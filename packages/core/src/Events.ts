import type { GameContext, GameRuntimeContext } from './types/Game'
import { EventDispatcher } from './utils/EventDispatcher'

// 游戏实例事件
export class GameEvents {
    // 初始化实例数据
    public static readonly setup = new EventDispatcher<GameContext>()
    // 启动幕循环
    public static readonly start = new EventDispatcher<GameContext>()
    // 初始化游戏完毕
    public static readonly ready = new EventDispatcher<GameContext>()
    // 自动结束
    public static readonly end = new EventDispatcher<GameContext>()
    // 主动退出
    public static readonly stop = new EventDispatcher<GameContext>()
    // 终止,结束/退出
    public static readonly exit = new EventDispatcher<GameContext>()
    // 挂起
    public static readonly suspend = new EventDispatcher<GameContext>()
    // 恢复
    public static readonly resume = new EventDispatcher<GameContext>()
    // 挂起/恢复
    public static readonly active = new EventDispatcher<boolean>()

    public static readonly onSetup = EventDispatcher.on(this.setup)
    public static readonly onReady = EventDispatcher.on(this.ready)
    public static readonly onStart = EventDispatcher.on(this.start)
    public static readonly onEnd = EventDispatcher.on(this.end)
    public static readonly onStop = EventDispatcher.on(this.stop)
    public static readonly onExit = EventDispatcher.on(this.exit)
    public static readonly onSuspend = EventDispatcher.on(this.suspend)
    public static readonly onResume = EventDispatcher.on(this.resume)
    public static readonly onActiveChange = EventDispatcher.on(this.active)

    constructor() {
        this.setup.subscribe((...args) => GameEvents.setup.publish(...args))
        this.ready.subscribe((...args) => GameEvents.ready.publish(...args))
        this.start.subscribe((...args) => GameEvents.start.publish(...args))
        this.end.subscribe((...args) => GameEvents.end.publish(...args))
        this.stop.subscribe((...args) => GameEvents.stop.publish(...args))
        this.exit.subscribe((...args) => GameEvents.exit.publish(...args))
        this.suspend.subscribe((...args) => GameEvents.suspend.publish(...args))
        this.resume.subscribe((...args) => GameEvents.resume.publish(...args))
        this.active.subscribe((...args) => GameEvents.active.publish(...args))
    }

    public readonly setup = new EventDispatcher<GameContext>()
    public readonly ready = new EventDispatcher<GameContext>()
    public readonly start = new EventDispatcher<GameContext>()
    public readonly end = new EventDispatcher<GameContext>()
    public readonly stop = new EventDispatcher<GameContext>()
    public readonly exit = new EventDispatcher<GameContext>()
    public readonly suspend = new EventDispatcher<GameContext>()
    public readonly resume = new EventDispatcher<GameContext>()
    public readonly active = new EventDispatcher<boolean>()

    public readonly onSetup = EventDispatcher.on(this.setup)
    public readonly onReady = EventDispatcher.on(this.ready)
    public readonly onStart = EventDispatcher.on(this.start)
    public readonly onEnd = EventDispatcher.on(this.end)
    public readonly onStop = EventDispatcher.on(this.stop)
    public readonly onExit = EventDispatcher.on(this.exit)
    public readonly onSuspend = EventDispatcher.on(this.suspend)
    public readonly onResume = EventDispatcher.on(this.resume)
    public readonly onActiveChange = EventDispatcher.on(this.active)
}

// 幕循环事件
export class ActEvents {
    // 启动幕循环
    public static readonly start = new EventDispatcher<GameRuntimeContext>()
    // 自动结束
    public static readonly end = new EventDispatcher<GameRuntimeContext>()
    // 进入下一幕
    public static readonly next = new EventDispatcher<GameContext>()
    // 单幕快进
    public static readonly rush = new EventDispatcher<GameRuntimeContext>()

    public static readonly onStart = EventDispatcher.on(this.start)
    public static readonly onEnd = EventDispatcher.on(this.end)
    public static readonly onRush = EventDispatcher.on(this.rush)
    public static readonly onNext = EventDispatcher.on(this.next)

    constructor() {
        this.start.subscribe((...args) => ActEvents.start.publish(...args))
        this.end.subscribe((...args) => ActEvents.end.publish(...args))
        this.rush.subscribe((...args) => ActEvents.rush.publish(...args))
        this.next.subscribe((...args) => ActEvents.next.publish(...args))
    }

    public readonly start = new EventDispatcher<GameRuntimeContext>()
    public readonly end = new EventDispatcher<GameRuntimeContext>()
    public readonly rush = new EventDispatcher<GameRuntimeContext>()
    public readonly next = new EventDispatcher<GameContext>()

    public readonly onStart = EventDispatcher.on(this.start)
    public readonly onEnd = EventDispatcher.on(this.end)
    public readonly onRush = EventDispatcher.on(this.rush)
    public readonly onNext = EventDispatcher.on(this.next)
}

// 游戏点击事件
export class ClickEvents {
    // 步进
    public static readonly step = new EventDispatcher<void>()
    // 快进/解除快进
    public static readonly fast = new EventDispatcher<void>()
    // 自动/解除自动
    public static readonly auto = new EventDispatcher<void>()

    public static readonly onStep = EventDispatcher.on(this.step)
    public static readonly onFast = EventDispatcher.on(this.fast)
    public static readonly onAuto = EventDispatcher.on(this.auto)

    constructor() {
        this.step.subscribe((...args) => ClickEvents.step.publish(...args))
        this.fast.subscribe((...args) => ClickEvents.fast.publish(...args))
        this.auto.subscribe((...args) => ClickEvents.auto.publish(...args))
    }

    public readonly step = new EventDispatcher<void>()
    public readonly fast = new EventDispatcher<void>()
    public readonly auto = new EventDispatcher<void>()

    public readonly onStep = EventDispatcher.on(this.step)
    public readonly onFast = EventDispatcher.on(this.fast)
    public readonly onAuto = EventDispatcher.on(this.auto)
}
