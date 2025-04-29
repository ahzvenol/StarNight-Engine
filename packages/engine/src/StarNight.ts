import type { Reactive } from 'micro-reactive-wrapper'
import type { AbstractGameBook } from './Book'
import type { CommandEntities, CommandOutput, Commands } from './types/Command'
import type { GameConstructorParams, GameContext, GameLocalData } from './types/Game'
import type { Macros } from './types/Marco'
import { delay, isString } from 'es-toolkit'
import { useReactiveWrapper } from 'micro-reactive-wrapper'
import { StarNightSystemCommands } from './commands'
import { fork } from './commands/system/schedule'
import { ActEvents, ClickEvents, GameEvents } from './Events'
import { GameState } from './types/Game'
import { PromiseX } from './utils/PromiseX'
import { randomUUID } from './utils/randomUUID'
import { RangeSet } from './utils/RangeSet'

export type { Reactive } from 'micro-reactive-wrapper'

export class StarNight {
    // 宏表
    public static Marcos: Macros = []
    // 命令表
    public static Commands: Commands = StarNightSystemCommands
    // 命令预设
    public static readonly SystemCommands = StarNightSystemCommands
    // 游戏实例事件
    public static readonly GameEvents = GameEvents
    // 幕循环事件
    public static readonly ActEvents = ActEvents
    // 主点击事件
    public static readonly ClickEvents = ClickEvents
    // 全局响应式函数
    public static useReactive: <T>(value: T) => Reactive<T> = useReactiveWrapper(<T>(v: T) => v)
    // 实例工厂方法
    public static instance = (params: GameConstructorParams) => new StarNightInstance(params)

    private constructor() {}

    static {
        // 事件日志绑定
        // 游戏初始化计时器
        StarNight.GameEvents.start.subscribe(({ instance: { uuid } }) => console.time(uuid))
        StarNight.ActEvents.ready.once(({ instance: { uuid } }) => console.timeEnd(uuid))

        StarNight.GameEvents.start.subscribe(() => console.info('Game:游戏开始'))
        StarNight.GameEvents.end.subscribe(() => console.info('Game:游戏结束'))
        StarNight.GameEvents.stop.subscribe(() => console.info('Game:游戏终止'))
        StarNight.GameEvents.exit.subscribe(() => console.info('Game:游戏退出'))
        StarNight.GameEvents.suspend.subscribe(() => console.info('Game:游戏挂起'))
        StarNight.GameEvents.resume.subscribe(() => console.info('Game:游戏从挂起中恢复'))
        StarNight.GameEvents.active.subscribe((active) => console.info(`Game:游戏活动状态:${active}`))

        StarNight.ActEvents.ready.subscribe(() => console.info(`Act:初始化完成`))
        StarNight.ActEvents.start.subscribe(({ state, current: { index } }) => {
            if (state.isInitializing()) {
                console.info(`Act:开始初始化第${index()}幕...`)
            } else {
                console.info(`Act:开始执行第${index()}幕...`)
            }
        })
        StarNight.ActEvents.end.subscribe(({ state, current: { index } }) => {
            if (!state.isInitializing()) console.info(`Act:第${index()}幕执行结束`)
        })
        StarNight.ActEvents.rush.subscribe(({ state }) => {
            if (!state.isInitializing()) console.info('Act:执行单幕快进')
        })
        StarNight.ActEvents.jump.subscribe(({ current: { index } }) => console.info(`Act:跳转到第${index()}幕`))

        StarNight.ClickEvents.step.subscribe(() => console.info('ClickEvent:触发点击事件'))
        StarNight.ClickEvents.fast.subscribe(() => console.info('ClickEvent:触发快进/解除快进事件'))
        StarNight.ClickEvents.auto.subscribe(() => console.info('ClickEvent:触发自动/解除自动事件'))
    }
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
    // 宏表
    public static Marcos: Macros = StarNight.Marcos
    // 命令表
    public static Commands: Commands = StarNight.Commands
    // 游戏实例事件
    public readonly GameEvents = new GameEvents()
    // 幕循环事件
    public readonly ActEvents = new ActEvents()
    // 主点击事件
    public readonly ClickEvents = new ClickEvents()
    // 游戏实例所持有的剧本
    public readonly book: AbstractGameBook
    // 唯一id,用于区分不同实例
    public readonly uuid = randomUUID()
    // 已读/未读标记
    public readonly isRead = StarNight.useReactive(false)
    // 游戏可见性,当游戏不可见时停止自动播放
    public readonly isGameVisible = StarNight.useReactive(true)
    // 游戏运行状态,从初始化状态进入普通/自动/快进三态转换
    public readonly state = new StarNightState()
    // 游戏本地状态,用于存档/读档功能
    public readonly current = StarNight.useReactive<GameLocalData>({ index: 0 })
    // 游戏实例上下文,是除单幕上下文外的基本上下文数据
    public readonly context: GameContext

    constructor(params: GameConstructorParams) {
        if (params.Marcos) StarNight.Marcos = params.Marcos
        if (params.Commands) StarNight.Commands = params.Commands

        this.GameEvents.active.subscribe((visible) => this.isGameVisible(visible))
        this.GameEvents.suspend.subscribe(() => this.GameEvents.active.publish(false))
        this.GameEvents.resume.subscribe(() => this.GameEvents.active.publish(true))
        this.GameEvents.stop.subscribe(() => this.GameEvents.exit.publish(this.context))
        this.GameEvents.end.subscribe(() => this.GameEvents.exit.publish(this.context))

        this.book = params.book
        this.context = {
            ...params,
            current: this.current,
            temp: {},
            instance: this
        } as GameContext
        this.GameEvents.setup.publish(this.context)

        ActLoop.bind(this)()
    }

    public start = () => this.GameEvents.start.publish(this.context)

    public stop = () => this.GameEvents.stop.publish(this.context)

    public suspend = () => {
        if (this.isGameVisible()) {
            this.GameEvents.suspend.publish(this.context)
        }
    }

    public resume = () => {
        if (!this.isGameVisible()) {
            this.GameEvents.resume.publish(this.context)
        }
    }
}

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
        // 如果用户离开游戏界面,等待用户回来
        if (!this.isGameVisible()) await this.GameEvents.onActiveChange()
        // 幕循环进行到存档幕,游戏本地状态已恢复,发布ready事件,转换到普通运行状态
        if (this.current.index() === this.context.local.index) {
            this.state.toNormal()
            this.ActEvents.ready.publish(this.context)
            // 这时才应该允许状态转换,否则影响初始化
            this.ClickEvents.auto.subscribe(() => (this.state.isAuto() ? this.state.toNormal() : this.state.toAuto()))
            this.ClickEvents.fast.subscribe(() => (this.state.isFast() ? this.state.toNormal() : this.state.toFast()))
        }
        // 由幕循环维护已读幕,这一操作需要在ActStart之前完成,所以不能借助事件
        const range = RangeSet.fromRanges(this.context.global.readsegment())
        this.isRead(range.includes(this.current.index()))
        if (!this.isRead()) {
            this.context.global.readsegment(range.push(this.current.index()).getRanges())
            // 处理在未读文本处解除快进的设置项
            if (this.state.isFast() && !this.context.config.fastforwardunread()) this.state.toNormal()
        }
        // ActStart前的初始化工作
        const onActRush = this.ActEvents.onRush()
        const output = {
            cont: StarNight.useReactive(false),
            jump: StarNight.useReactive(undefined),
            end: StarNight.useReactive(false),
            state: StarNight.useReactive(undefined)
        } as CommandOutput
        const state = new StarNightStateStatic(this.state.now())
        const context = { ...this.context, state, output, onActRush, onGameStop }
        if (this.state.isInitializing() || this.state.isFast()) this.ActEvents.rush.publish(context)
        // ActStart
        this.ActEvents.start.publish(context)
        // 收集命令返回的运行数据,处理可能影响游戏流程的部分,如jump和continue
        await fork.apply(context)(this.book.act(this.current.index()) as CommandEntities[])
        // ActEnd
        this.ActEvents.end.publish(context)
        if (output.state() && !this.state.isInitializing()) this.state.now(output.state()!)
        // 等待过程受continue命令影响
        // eslint-disable-next-line no-empty
        if (this.state.isInitializing() || output.cont()) {
        } else if (this.state.isFast()) {
            await delay(this.context.config.fastreadspeed())
        } else if (this.state.isAuto()) {
            await delay(this.context.config.autoreadspeed())
        } else {
            await Promise.race([this.ClickEvents.onStep(), this.ClickEvents.onAuto(), this.ClickEvents.onFast()])
        }
        // jump命令修改接下来一幕的index
        const jump = output.jump()
        const target = isString(jump) ? this.book.label(jump) : Number.isFinite(jump) ? jump : undefined
        this.current.index(target !== undefined ? target : this.current.index() + 1)
        // 游戏实例已销毁时退出,初始化时不判断以优化初始化速度
        const isStop = !this.state.isInitializing() && (await PromiseX.isSettled(onGameStop))
        if (isStop) return this.GameEvents.stop.publish(this.context)
        // 通过end命令退出 || 超过最后一幕自动退出
        const isEnd = output.end() || this.current.index() >= this.book.length()
        if (isEnd) return this.GameEvents.end.publish(this.context)
        // 没有因为某种原因退出才发布跳转事件
        if (target !== undefined) this.ActEvents.jump.publish(this.context)
    }
}
