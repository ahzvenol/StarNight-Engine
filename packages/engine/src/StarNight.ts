import { delay, isString, noop } from 'es-toolkit'
import { Reactive } from 'micro-reactive-solid'
import { wait } from './commands/script/wait'
import { cont, end, jump, label } from './commands/system/branch'
import { chain, fork, par } from './commands/system/schedule'
import { ActEvents, ClickEvents, GameEvents } from './Events'
import { CommandEntities, Commands } from './types/Command'
import { GameLocalData, GameStartOptions, GameState } from './types/Game'
import { Macros } from './types/Marco'
import { PromiseX } from './utils/PromiseX'
import { RangeSet } from './utils/RangeSet'

export class StarNight {
    // 命令表
    public static Commands: Commands = { continue: cont, jump, end, label, fork, par, chain, wait }
    // 宏表
    public static Marcos: Macros = []

    public static readonly GameEvents = new GameEvents()

    public static readonly ActEvents = new ActEvents()

    public static readonly ClickEvents = new ClickEvents()

    private static useSignal: <T>(value: T) => Reactive<T>

    static {
        // 在一幕的效果没有全部执行完毕的情况下,第二次点击会加速本幕
        // 如果本幕的命令都已经执行完成了,就可以解除对于第二次点击的监听
        StarNight.ActEvents.start.subscribe(async (context) => {
            const { state, onActRush: rush, onGameDestroy: destroy, instance } = context
            const { ClickEvents, ActEvents } = instance
            if (state === GameState.Init || state === GameState.Fast) return
            const flag = new PromiseX<'Fast' | 'Destroy'>()
            Promise.race([ClickEvents.onStep(), ClickEvents.onFast()]).then(() => flag.resolve('Fast'))
            Promise.race([ActEvents.onEnd(), destroy]).then(() => flag.resolve('Destroy'))
            if ((await flag) === 'Destroy') return
            ActEvents.rush.publish(context)
            ;(rush as PromiseX<void>).resolve()
        })
    }

    public static Instance(useSignal: <T>(value: T) => Reactive<T>): StarNight {
        StarNight.useSignal = useSignal
    }

    private constructor() {
        this.GameEvents.visibility.subscribe((visible) => this.isGameVisible(visible))
    }

    public readonly GameEvents = new GameEvents()

    public readonly ActEvents = new ActEvents()

    public readonly ClickEvents = new ClickEvents()

    // 游戏可见性
    public isGameVisible = StarNight.useSignal(true)
    // 已读/未读标记
    public isRead = StarNight.useSignal(false)
    // 游戏状态
    public state = StarNight.useSignal(GameState.Init)
    // 游戏数据
    public current = StarNight.useSignal<GameLocalData>({ index: 0 })

    public async run({ book, config, local, global }: GameStartOptions) {
        console.time()
        const index = this.current.index
        const destroy = this.GameEvents.onDestroy()
        const readsegment = global.readsegment
        this.ActEvents.ready.once(() => console.timeEnd())
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
            const rush = new PromiseX<void>()
            if (this.state() === GameState.Init || this.state() === GameState.Fast) rush.resolve()
            const context = { current: this.current, config, global, local, state: this.state(), rush, destroy }
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
            const isCleanup = this.state() !== GameState.Init && (await PromiseX.isSettled(destroy))
            // 通过end命令退出 || 超过最后一幕自动退出
            const isEnd = output['end'] === true || index() >= book.length()
            if (isEnd) return Promise.resolve()
            if (isCleanup) return new Promise(noop)
            if (target !== undefined) this.ActEvents.jump.publish({ index: target })
        }
    }
}

StarNight.GameEvents.start.subscribe(() => console.info('Game:游戏开始'))
StarNight.GameEvents.end.subscribe(() => console.info('Game:游戏结束'))
StarNight.GameEvents.destroy.subscribe(() => console.info('Game:游戏销毁'))
StarNight.GameEvents.exit.subscribe(() => console.info('Game:游戏退出'))
StarNight.GameEvents.suspend.subscribe(() => console.info('Game:游戏挂起'))
StarNight.GameEvents.resume.subscribe(() => console.info('Game:游戏从挂起中恢复'))
StarNight.GameEvents.visibility.subscribe((visible) => console.info(`Game:游戏可见性变动:可见性:${visible}`))
this.start.subscribe(() => console.info('Game:游戏开始'))
this.end.subscribe(() => console.info('Game:游戏结束'))
this.destroy.subscribe(() => console.info('Game:游戏销毁'))
this.exit.subscribe(() => console.info('Game:游戏退出'))
this.end.subscribe(() => this.exit.publish())
this.destroy.subscribe(() => this.exit.publish())
this.suspend.subscribe(() => console.info('Game:游戏挂起'))
this.resume.subscribe(() => console.info('Game:游戏从挂起中恢复'))
this.visibility.subscribe((visible) => console.info(`Game:游戏可见性变动:可见性:${visible}`))
this.suspend.subscribe(() => this.visibility.publish(false))
this.resume.subscribe(() => this.visibility.publish(true))

StarNight.ActEvents.ready.subscribe((index) => console.info(`Act:初始化完成,当前是第${index}幕`))
StarNight.ActEvents.start.subscribe(({ state, current: { index } }) =>
    state === GameState.Init ? console.info(`Act:正在初始化第${index}幕`) : console.info(`Act:开始执行第${index}幕...`)
)
StarNight.ActEvents.end.subscribe(
    ({ state, current: { index } }) => state !== GameState.Init && console.info(`Act:第${index}幕执行结束`)
)
StarNight.ActEvents.rush.subscribe(() => console.info('Act:执行单幕快进'))
StarNight.ActEvents.jump.subscribe((target) => console.info(`Act:跳转到第${target}幕`))


this.ready.subscribe((index) => console.info(`Act:初始化完成,当前是第${index}幕`))
this.start.subscribe(({ state, current: { index } }) =>
    state === GameState.Init ? console.info(`Act:正在初始化第${index}幕`) : console.info(`Act:开始执行第${index}幕...`)
)
this.end.subscribe(
    ({ state, current: { index } }) => state !== GameState.Init && console.info(`Act:第${index}幕执行结束`)
)
this.rush.subscribe(() => console.info('Act:执行单幕快进'))
this.jump.subscribe((target) => console.info(`Act:跳转到第${target}幕`))

StarNight.ClickEvents.step.subscribe(() => console.info('ClickEvent:触发点击事件'))
StarNight.ClickEvents.fast.subscribe(() => console.info('ClickEvent:触发快进/解除快进事件'))
StarNight.ClickEvents.auto.subscribe(() => console.info('ClickEvent:触发自动/解除自动事件'))
this.step.subscribe(() => console.info('ClickEvent:触发点击事件'))
this.fast.subscribe(() => console.info('ClickEvent:触发快进/解除快进事件'))
this.auto.subscribe(() => console.info('ClickEvent:触发自动/解除自动事件'))
