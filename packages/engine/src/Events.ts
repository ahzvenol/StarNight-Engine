import type { GameRuntimeContext } from './types/Game'
import { GameState } from './types/Game'
import { EventDispatcher, on } from './utils/EventDispatcher'

// 游戏实例事件
export class GameEvents {
    public readonly start = new EventDispatcher<void>()
    public readonly end = new EventDispatcher<void>()
    public readonly destroy = new EventDispatcher<void>()
    public readonly exit = new EventDispatcher<void>()
    public readonly visibility = new EventDispatcher<boolean>()
    public readonly suspend = new EventDispatcher<void>()
    public readonly resume = new EventDispatcher<void>()

    public readonly onStart = on(this.start)
    public readonly onEnd = on(this.end)
    public readonly onDestroy = on(this.destroy)
    public readonly onExit = on(this.exit)
    public readonly onVisibilityChange = on(this.visibility)
    public readonly onSuspend = on(this.suspend)
    public readonly onResume = on(this.resume)

    constructor() {
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
    }
}

// 幕循环事件
export class ActEvents {
    public readonly ready = new EventDispatcher<{ index: number }>()
    public readonly start = new EventDispatcher<GameRuntimeContext>()
    public readonly end = new EventDispatcher<GameRuntimeContext>()
    public readonly rush = new EventDispatcher<GameRuntimeContext>()
    public readonly jump = new EventDispatcher<{ index: number }>()

    public readonly onReady = on(this.ready)
    public readonly onStart = on(this.start)
    public readonly onEnd = on(this.end)
    public readonly onRush = on(this.rush)
    public readonly onJump = on(this.jump)

    constructor() {
        this.ready.subscribe((index) => console.info(`Act:初始化完成,当前是第${index}幕`))
        this.start.subscribe(({ state, current: { index } }) =>
            state === GameState.Init
                ? console.info(`Act:正在初始化第${index}幕`)
                : console.info(`Act:开始执行第${index}幕...`)
        )
        this.end.subscribe(
            ({ state, current: { index } }) => state !== GameState.Init && console.info(`Act:第${index}幕执行结束`)
        )
        this.rush.subscribe(() => console.info('Act:执行单幕快进'))
        this.jump.subscribe((target) => console.info(`Act:跳转到第${target}幕`))
    }
}

// 游戏点击事件
export class ClickEvents {
    public readonly step = new EventDispatcher<void>()
    public readonly fast = new EventDispatcher<void>()
    public readonly auto = new EventDispatcher<void>()

    public readonly onStep = on(this.step)
    public readonly onFast = on(this.fast)
    public readonly onAuto = on(this.auto)

    constructor() {
        this.step.subscribe(() => console.info('ClickEvent:触发点击事件'))
        this.fast.subscribe(() => console.info('ClickEvent:触发快进/解除快进事件'))
        this.auto.subscribe(() => console.info('ClickEvent:触发自动/解除自动事件'))
    }
}
