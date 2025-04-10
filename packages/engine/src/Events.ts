import type { GameContext, GameRuntimeContext } from './types/Game'
import { EventDispatcher, on } from './utils/EventDispatcher'

// 游戏实例事件
export class GameEvents {
    public static readonly start = new EventDispatcher<GameContext>()
    public static readonly end = new EventDispatcher<GameContext>()
    public static readonly destroy = new EventDispatcher<GameContext>()
    public static readonly exit = new EventDispatcher<GameContext>()
    public static readonly visibility = new EventDispatcher<boolean>()
    public static readonly suspend = new EventDispatcher<void>()
    public static readonly resume = new EventDispatcher<void>()

    public static readonly onStart = on(this.start)
    public static readonly onEnd = on(this.end)
    public static readonly onDestroy = on(this.destroy)
    public static readonly onExit = on(this.exit)
    public static readonly onVisibilityChange = on(this.visibility)
    public static readonly onSuspend = on(this.suspend)
    public static readonly onResume = on(this.resume)

    constructor() {
        this.start.subscribe((...args) => GameEvents.start.publish(...args))
        this.end.subscribe((...args) => GameEvents.end.publish(...args))
        this.destroy.subscribe((...args) => GameEvents.destroy.publish(...args))
        this.exit.subscribe((...args) => GameEvents.exit.publish(...args))
        this.visibility.subscribe((...args) => GameEvents.visibility.publish(...args))
        this.suspend.subscribe((...args) => GameEvents.suspend.publish(...args))
        this.resume.subscribe((...args) => GameEvents.resume.publish(...args))
    }

    public readonly start = new EventDispatcher<GameContext>()
    public readonly end = new EventDispatcher<GameContext>()
    public readonly destroy = new EventDispatcher<GameContext>()
    public readonly exit = new EventDispatcher<GameContext>()
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
}

// 幕循环事件
export class ActEvents {
    public static readonly ready = new EventDispatcher<{ index: number }>()
    public static readonly start = new EventDispatcher<GameRuntimeContext>()
    public static readonly end = new EventDispatcher<GameRuntimeContext>()
    public static readonly rush = new EventDispatcher<GameRuntimeContext>()
    public static readonly jump = new EventDispatcher<{ index: number }>()

    public static readonly onReady = on(this.ready)
    public static readonly onStart = on(this.start)
    public static readonly onEnd = on(this.end)
    public static readonly onRush = on(this.rush)
    public static readonly onJump = on(this.jump)

    constructor() {
        this.ready.subscribe((...args) => ActEvents.ready.publish(...args))
        this.start.subscribe((...args) => ActEvents.start.publish(...args))
        this.end.subscribe((...args) => ActEvents.end.publish(...args))
        this.rush.subscribe((...args) => ActEvents.rush.publish(...args))
        this.jump.subscribe((...args) => ActEvents.jump.publish(...args))
    }

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
}

// 游戏点击事件
export class ClickEvents {
    public static readonly step = new EventDispatcher<void>()
    public static readonly fast = new EventDispatcher<void>()
    public static readonly auto = new EventDispatcher<void>()

    public static readonly onStep = on(this.step)
    public static readonly onFast = on(this.fast)
    public static readonly onAuto = on(this.auto)

    constructor() {
        this.step.subscribe((...args) => ClickEvents.step.publish(...args))
        this.fast.subscribe((...args) => ClickEvents.fast.publish(...args))
        this.auto.subscribe((...args) => ClickEvents.auto.publish(...args))
    }

    public readonly step = new EventDispatcher<void>()
    public readonly fast = new EventDispatcher<void>()
    public readonly auto = new EventDispatcher<void>()

    public readonly onStep = on(this.step)
    public readonly onFast = on(this.fast)
    public readonly onAuto = on(this.auto)
}
