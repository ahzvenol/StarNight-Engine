import type { Reactive } from 'micro-reactive-wrapper'
import type { CommandOutput } from './types/Command'
import type { GameConstructorParams, GameContext, GameLocalData, GameScript } from './types/Game'
import { delay } from 'es-toolkit'
import { useReactiveWrapper } from 'micro-reactive-wrapper'
import { Fork } from './Decorator'
import { ActEvents, ClickEvents, GameEvents } from './Events'
import { GameState } from './types/Game'
import { PromiseX } from './utils/PromiseX'
import { randomUUID } from './utils/randomUUID'
import { RangeSet } from './utils/RangeSet'

export type { Reactive } from 'micro-reactive-wrapper'

export class StarNight {
    /** 游戏实例事件 */
    public static readonly GameEvents = GameEvents
    /** 幕循环事件 */
    public static readonly ActEvents = ActEvents
    /** 点击事件 */
    public static readonly ClickEvents = ClickEvents
    /** 全局响应式函数 */
    public static useReactive: <T>(value: T) => Reactive<T> = useReactiveWrapper(<T>(arg0: T) => arg0)
    /** 实例工厂方法 */
    public static instance = (params: GameConstructorParams) => new StarNightInstance(params)

    private constructor() {}
}

export class StarNightState {
    public readonly now = StarNight.useReactive(GameState.Initializing)

    public isInitializing = () => this.now() === GameState.Initializing

    public isNormal = () => this.now() === GameState.Normal

    public isAuto = () => this.now() === GameState.Auto

    public isFast = () => this.now() === GameState.Fast

    public toNormal = () => this.now(GameState.Normal)

    public toAuto = () => this.now(GameState.Auto)

    public toFast = () => this.now(GameState.Fast)
}

export class StarNightStateStatic {
    constructor(public readonly now: number) {}

    public isInitializing = () => this.now === GameState.Initializing

    public isNormal = () => this.now === GameState.Normal

    public isAuto = () => this.now === GameState.Auto

    public isFast = () => this.now === GameState.Fast
}

export class StarNightInstance {
    /** 游戏实例事件 */
    public readonly GameEvents = new GameEvents()
    /** 幕循环事件 */
    public readonly ActEvents = new ActEvents()
    /** 点击事件 */
    public readonly ClickEvents = new ClickEvents()
    /** 游戏实例所持有的剧本 */
    public readonly script: GameScript
    /** 唯一 id，用于区分不同实例 */
    public readonly uuid = randomUUID()
    /** 已读/未读标记 */
    public readonly isRead = StarNight.useReactive(false)
    /** 游戏可见性，当游戏不可见时停止自动播放 */
    public readonly isGameVisible = StarNight.useReactive(true)
    /** 游戏运行状态，从初始化状态进入普通/自动/快进三态转换 */
    public readonly state = new StarNightState()
    /** 游戏实例状态，用于存档/读档功能 */
    public readonly current = StarNight.useReactive({ count: -1, index: NaN, sence: 'unknown' }) as Reactive<GameLocalData>
    /** 游戏实例上下文，是除单幕上下文外的基本上下文数据 */
    public readonly context: GameContext

    constructor(params: GameConstructorParams) {
        this.GameEvents.active.subscribe((visible) => this.isGameVisible(visible))
        this.GameEvents.suspend.subscribe(() => this.GameEvents.active.publish(false))
        this.GameEvents.resume.subscribe(() => this.GameEvents.active.publish(true))
        this.GameEvents.stop.subscribe(() => this.GameEvents.exit.publish(this.context))
        this.GameEvents.end.subscribe(() => this.GameEvents.exit.publish(this.context))

        this.script = params.script
        this.context = {
            ...params,
            current: this.current,
            temp: {} as GameContext['temp'],
            instance: this
        } as GameContext
        this.GameEvents.setup.publish(this.context)

        ActLoop.bind(this)()
    }

    /** 开始游戏 */
    public start = () => this.GameEvents.start.publish(this.context)
    /** 退出游戏 */
    public stop = () => this.GameEvents.stop.publish(this.context)
    /** 挂起游戏 */
    public suspend = () => {
        if (this.isGameVisible()) {
            this.GameEvents.suspend.publish(this.context)
        }
    }
    /** 恢复游戏 */
    public resume = () => {
        if (!this.isGameVisible()) {
            this.GameEvents.resume.publish(this.context)
        }
    }
}

// 维护已读幕
StarNight.ActEvents.next.subscribe(async ({ instance }) => {
    if (!Number.isInteger(instance.current.index())) return
    const currentsegment = instance.context.global.readsegment[instance.current.sence()]
    currentsegment((arr) => arr || [])
    const range = RangeSet.fromRanges(currentsegment())
    instance.isRead(range.includes(instance.current.index()))
    if (!instance.isRead()) {
        currentsegment(range.push(instance.current.index()).getRanges())
        // 处理在未读文本处解除快进的设置项
        if (instance.state.isFast() && !instance.context.config.fastforwardunread()) instance.state.toNormal()
    }
})

// 在一幕的效果没有全部执行完毕的情况下,第二次点击会加速本幕
// 如果本幕的命令都已经执行完成了,就可以解除对于第二次点击的监听
StarNight.ActEvents.start.subscribe(async (context) => {
    const { state, onGameStop, instance } = context
    const { ClickEvents, ActEvents } = instance
    if (state.isInitializing() || state.isFast()) return
    const flag = new PromiseX<'Rush' | 'Stop'>()
    Promise.race([ClickEvents.onStep(), ClickEvents.onFast()]).then(() => flag.resolve('Rush'))
    Promise.race([ActEvents.onEnd(), onGameStop]).then(() => flag.resolve('Stop'))
    if ((await flag) === 'Stop') return
    ActEvents.rush.publish(context)
})

async function ActLoop(this: StarNightInstance) {
    // 等待游戏开始事件
    await this.GameEvents.onStart()
    // 不能在开始前结束游戏
    const onGameStop = this.GameEvents.onStop()
    while (true) {
        const { value, done } = this.script.next()
        // 超出剧本时退出
        if (done) return this.GameEvents.end.publish(this.context)
        this.current.count(this.current.count() + 1)
        // 如果用户离开游戏界面,等待用户回来
        if (!this.isGameVisible()) await this.GameEvents.onActiveChange()
        // 幕循环进行到存档幕,游戏本地状态已恢复,发布ready事件,转换到普通运行状态
        if (this.current.count() === this.context.local.count) {
            this.state.toNormal()
            this.GameEvents.ready.publish(this.context)
            // 这时才应该允许状态转换,否则影响初始化
            this.ClickEvents.auto.subscribe(() => (this.state.isAuto() ? this.state.toNormal() : this.state.toAuto()))
            this.ClickEvents.fast.subscribe(() => (this.state.isFast() ? this.state.toNormal() : this.state.toFast()))
        }
        // ActStart前的初始化工作
        this.ActEvents.next.publish(this.context)
        const onActRush = this.ActEvents.onRush()
        // 通过output收集命令返回的特殊数据
        const output: CommandOutput = StarNight.useReactive({ cont: false, end: false, state: undefined, extime: undefined })
        const state = new StarNightStateStatic(this.state.now())
        const context = { ...this.context, state, output, onActRush, onGameStop }
        if (this.state.isInitializing() || this.state.isFast()) this.ActEvents.rush.publish(context)
        // ActStart
        this.ActEvents.start.publish(context)
        // Fork返回下一幕的index
        const next = await Fork(value)(context)
        // ActEnd
        this.ActEvents.end.publish(context)
        if (!this.state.isInitializing() && output.state()) this.state.now(output.state()!)
        // 等待过程受continue命令影响
        if (!this.state.isInitializing() && !output.cont()) {
            if (this.state.isFast()) {
                // 在快进状态下等待一段时间
                await delay(this.context.config.fastreadspeed())
            } else if (this.state.isAuto()) {
                // 等待额外计时后再等待一段时间，之后如果还处于自动模式则resolve，否则继续等待自动事件
                const onAutoNext = Promise.resolve(output.extime())
                    .then(() => delay(this.context.config.autoreadspeed()))
                    .then(() => (!this.state.isAuto() ? this.ClickEvents.onAuto() : Promise.resolve()))
                // 在自动状态下等待步进、快进事件和onAutoNext
                await Promise.race([this.ClickEvents.onStep(), onAutoNext, this.ClickEvents.onFast()])
            } else {
                // 在普通状态下等待步进、自动、快进事件
                await Promise.race([this.ClickEvents.onStep(), this.ClickEvents.onAuto(), this.ClickEvents.onFast()])
            }
        }
        if (Number.isInteger(next)) this.current.index(next)
        // 游戏实例已销毁时退出,初始化时忽略以优化初始化速度。不需要发送事件,因为这个事件已经由用户发出
        if (!this.state.isInitializing() && (await PromiseX.isSettled(onGameStop))) return
        if (output.end()) return this.GameEvents.end.publish(this.context) // 通过end标志退出
    }
}
