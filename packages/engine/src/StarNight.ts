import { delay, isString, noop } from 'es-toolkit'
import { Reactive } from 'micro-reactive-solid'
import { StarNightSystemCommands } from './commands'
import { fork } from './commands/system/schedule'
import { ActEvents, ClickEvents, GameEvents } from './Events'
import { CommandEntities, Commands } from './types/Command'
import { GameLocalData, GameStartOptions, GameState } from './types/Game'
import { Macros } from './types/Marco'
import { PromiseX } from './utils/PromiseX'
import { RangeSet } from './utils/RangeSet'

export class StarNight {
    // 宏表
    public static Marcos: Macros = []
    // 命令表
    public static Commands: Commands = StarNightSystemCommands

    public static readonly GameEvents = new GameEvents()

    public static readonly ActEvents = new ActEvents()

    public static readonly ClickEvents = new ClickEvents()

    private static useReactive: <T>(value: T) => Reactive<T>

    static {
        // 在一幕的效果没有全部执行完毕的情况下,第二次点击会加速本幕
        // 如果本幕的命令都已经执行完成了,就可以解除对于第二次点击的监听
        StarNight.ActEvents.start.subscribe(async (context) => {
            const { state, onGameDestroy, instance } = context
            const { ClickEvents, ActEvents } = instance
            if (state === GameState.Init || state === GameState.Fast) return
            const flag = new PromiseX<'Fast' | 'Destroy'>()
            Promise.race([ClickEvents.onStep(), ClickEvents.onFast()]).then(() => flag.resolve('Fast'))
            Promise.race([ActEvents.onEnd(), onGameDestroy]).then(() => flag.resolve('Destroy'))
            if ((await flag) === 'Destroy') return
            ActEvents.rush.publish(context)
        })
    }

    public static Instance(useReactive: <T>(value: T) => Reactive<T>): StarNight {
        StarNight.useReactive = useReactive
    }

    private constructor() {
        // ----
        this.GameEvents.start.subscribe((...args) => StarNight.GameEvents.start.publish(...args))
        this.GameEvents.end.subscribe((...args) => StarNight.GameEvents.end.publish(...args))
        this.GameEvents.destroy.subscribe((...args) => StarNight.GameEvents.destroy.publish(...args))
        this.GameEvents.exit.subscribe((...args) => StarNight.GameEvents.exit.publish(...args))
        this.GameEvents.visibility.subscribe((...args) => StarNight.GameEvents.visibility.publish(...args))
        this.GameEvents.suspend.subscribe((...args) => StarNight.GameEvents.suspend.publish(...args))
        this.GameEvents.resume.subscribe((...args) => StarNight.GameEvents.resume.publish(...args))
        // ----
        this.ActEvents.ready.subscribe((...args) => StarNight.ActEvents.ready.publish(...args))
        this.ActEvents.start.subscribe((...args) => StarNight.ActEvents.start.publish(...args))
        this.ActEvents.end.subscribe((...args) => StarNight.ActEvents.end.publish(...args))
        this.ActEvents.rush.subscribe((...args) => StarNight.ActEvents.rush.publish(...args))
        this.ActEvents.jump.subscribe((...args) => StarNight.ActEvents.jump.publish(...args))
        // ----
        this.ClickEvents.step.subscribe((...args) => StarNight.ClickEvents.step.publish(...args))
        this.ClickEvents.fast.subscribe((...args) => StarNight.ClickEvents.fast.publish(...args))
        this.ClickEvents.auto.subscribe((...args) => StarNight.ClickEvents.auto.publish(...args))
    }

    public readonly GameEvents = new GameEvents()

    public readonly ActEvents = new ActEvents()

    public readonly ClickEvents = new ClickEvents()

    // 游戏可见性
    public isGameVisible = StarNight.useReactive(true)
    // 已读/未读标记
    public isRead = StarNight.useReactive(false)
    // 游戏状态
    public state = StarNight.useReactive(GameState.Init)
    // 游戏数据
    public current = StarNight.useReactive<GameLocalData>({ index: 0 })

    public async run({ book, config, local, global }: GameStartOptions) {
        this.GameEvents.start.publish({})
        this.GameEvents.visibility.subscribe((visible) => this.isGameVisible(visible))
        this.GameEvents.suspend.subscribe(() => this.GameEvents.visibility.publish(false))
        this.GameEvents.resume.subscribe(() => this.GameEvents.visibility.publish(true))
        const index = this.current.index
        const readsegment = global.readsegment
        const onGameDestroy = this.GameEvents.onDestroy()

        this.ActEvents.ready.once(() => this.state(GameState.Normal))
        this.ClickEvents.auto.subscribe(() =>
            this.state(this.state() === GameState.Auto ? GameState.Normal : GameState.Auto)
        )
        this.ClickEvents.fast.subscribe(() =>
            this.state(this.state() === GameState.Fast ? GameState.Normal : GameState.Fast)
        )
        // eslint-disable-next-line no-constant-condition
        while (true) {
            if (index() === local.index) this.ActEvents.ready.publish({ index: index() })
            // 由幕循环维护已读幕,这一操作需要在ActStart之前完成,所以不能借助事件
            const range = RangeSet.fromRanges(readsegment())
            this.isRead(range.includes(index()))
            if (!this.isRead()) readsegment(range.push(index()).getRanges())
            // 处理在未读文本处解除快进的设置项
            if (this.state() === GameState.Fast && !config.fastforwardunread() && !this.isRead()) {
                this.state(GameState.Normal)
            }
            // ActStart前的初始化工作
            const onActRush = this.ActEvents.onRush()
            const context = {
                current: this.current,
                config,
                global,
                local,
                state: this.state(),
                onActRush,
                onGameDestroy
            }
            if (this.state() === GameState.Init || this.state() === GameState.Fast) this.ActEvents.rush.publish(context)
            // ActStart
            this.ActEvents.start.publish(context)
            // 收集命令返回的运行数据,处理可能影响游戏流程的部分,如jump和continue
            const output = await fork.apply(context)(book.act(index()) as CommandEntities[])
            // ActEnd
            this.ActEvents.end.publish(context)
            if (output['state'] && this.state() !== GameState.Init) this.state(output['state'])
            // 等待过程受continue命令影响
            if (this.state() === GameState.Init || output['continue'] === true) {
            } else if (this.state() === GameState.Fast) {
                await delay(config.fastreadspeed())
            } else if (this.state() === GameState.Auto) {
                await delay(config.autoreadspeed())
            } else {
                await Promise.race([this.ClickEvents.onStep(), this.ClickEvents.onAuto(), this.ClickEvents.onFast()])
            }
            // 如果用户离开游戏界面,等待用户回来
            if (!this.isGameVisible()) await this.GameEvents.onVisibilityChange()
            // jump命令修改接下来一幕的index
            const jump = output['jump']
            const target = isString(jump) ? book.label(jump) : Number.isFinite(jump) ? jump : undefined
            index(target !== undefined ? target : index() + 1)
            // 游戏实例已销毁时退出,初始化时不判断以优化初始化速度
            const isDestroy = this.state() !== GameState.Init && (await PromiseX.isSettled(onGameDestroy))
            // 通过end命令退出 || 超过最后一幕自动退出
            const isEnd = output['end'] === true || index() >= book.length()
            if (isEnd) return this.GameEvents.end.publish()
            if (isDestroy) return this.GameEvents.destroy.publish()
            if (target !== undefined) this.ActEvents.jump.publish({ index: target })
        }
    }
}

StarNight.GameEvents.start.subscribe(() => console.time())
StarNight.ActEvents.ready.once(() => console.timeEnd())

StarNight.GameEvents.start.subscribe(() => console.info('Game:游戏开始'))
StarNight.GameEvents.end.subscribe(() => console.info('Game:游戏结束'))
StarNight.GameEvents.destroy.subscribe(() => console.info('Game:游戏销毁'))
StarNight.GameEvents.exit.subscribe(() => console.info('Game:游戏退出'))
StarNight.GameEvents.suspend.subscribe(() => console.info('Game:游戏挂起'))
StarNight.GameEvents.resume.subscribe(() => console.info('Game:游戏从挂起中恢复'))
StarNight.GameEvents.visibility.subscribe((visible) => console.info(`Game:游戏可见性变动:可见性:${visible}`))

StarNight.ActEvents.ready.subscribe((index) => console.info(`Act:初始化完成,当前是第${index}幕`))
StarNight.ActEvents.start.subscribe(({ state, current: { index } }) =>
    state === GameState.Init ? console.info(`Act:正在初始化第${index}幕`) : console.info(`Act:开始执行第${index}幕...`)
)
StarNight.ActEvents.end.subscribe(
    ({ state, current: { index } }) => state !== GameState.Init && console.info(`Act:第${index}幕执行结束`)
)
StarNight.ActEvents.rush.subscribe(() => console.info('Act:执行单幕快进'))
StarNight.ActEvents.jump.subscribe((target) => console.info(`Act:跳转到第${target}幕`))

StarNight.ClickEvents.step.subscribe(() => console.info('ClickEvent:触发点击事件'))
StarNight.ClickEvents.fast.subscribe(() => console.info('ClickEvent:触发快进/解除快进事件'))
StarNight.ClickEvents.auto.subscribe(() => console.info('ClickEvent:触发自动/解除自动事件'))
