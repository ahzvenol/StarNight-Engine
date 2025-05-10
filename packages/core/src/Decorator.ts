import type {
    BlockingCommand,
    DynamicCommand,
    MacroCommand,
    NonBlockingCommand,
    StandardBlockingCommand,
    StandardCommand,
    StandardDynamicCommand,
    StandardNonBlockingCommand
} from './types/Command'
import type { GameAct } from './types/Game'
import type { Function0 } from './types/Meta'
import { run } from './utils/runGenerator'

// 只在本幕内产生效果的命令,由此不需要初始化
export function ActScope<T, R>(fn: StandardNonBlockingCommand<T, R>): StandardNonBlockingCommand<T, R | void>
export function ActScope<T, R>(fn: StandardBlockingCommand<T, R>): StandardBlockingCommand<T, R | void>
export function ActScope<T, R>(fn: StandardDynamicCommand<T, R>): StandardDynamicCommand<T, R | void>
export function ActScope<T, R>(fn: StandardCommand<T, R>): StandardCommand<T, R | void> {
    return (args) => async (context) => {
        if (!context.state.isInitializing()) return fn(args)(context)
    }
}

// 只在执行过程中产生效果的命令,这样的命令应当也是ActScope的
export function EffectScope<T, R>(fn: StandardNonBlockingCommand<T, R>): StandardNonBlockingCommand<T, R | void>
export function EffectScope<T, R>(fn: StandardBlockingCommand<T, R>): StandardBlockingCommand<T, R | void>
export function EffectScope<T, R>(fn: StandardDynamicCommand<T, R>): StandardDynamicCommand<T, R | void>
export function EffectScope<T, R>(fn: StandardCommand<T, R>): StandardCommand<T, R | void> {
    return (args) => async (context) => {
        if (!context.state.isInitializing() && !context.state.isFast()) return fn(args)(context)
    }
}

// 不产生任何效果的虚拟命令
export function VirtualScope<T>(): StandardCommand<T, void> {
    return () => async () => {}
}

// 辅助函数,标准化命令输出以方便下一环节处理
function normalize<R>(output: Function0<R>): Promise<R> {
    return new Promise((res) => res(output())).catch((error) => console.error('命令运行出错:', error)) as Promise<R>
}

// 具有一定的执行时间,但也可以立即完成命令行为,由引擎调度是否阻塞的动态命令
export function Dynamic<T = void, R = void>(fn: DynamicCommand<T, R>): StandardDynamicCommand<T, R> {
    return ((args) => async (context) => {
        const { onActRush: rush, onGameStop: stop } = context
        const generator = fn(context)(args)
        return normalize(() => run(generator, { rush, stop })) as Promise<R>
    }) as StandardDynamicCommand<T, R>
}

// 默认阻塞的动态命令
export function DynamicBlocking<T = void, R = void>(fn: DynamicCommand<T, R>): StandardBlockingCommand<T, R> {
    return ((args) => async (context) => {
        const { onActRush: rush, onGameStop: stop } = context
        const generator = fn(context)(args)
        return normalize(() => run(generator, { rush, stop })) as Promise<R>
    }) as StandardBlockingCommand<T, R>
}

// 没有有意义的执行时间,所以也不能产生任何阻塞的命令
export function NonBlocking<T = void, R = void>(fn: NonBlockingCommand<T, R>): StandardNonBlockingCommand<T, R> {
    return ((args) => async (context) => normalize(() => fn(context)(args))) as StandardNonBlockingCommand<T, R>
}

// 需要等待用户输入的命令,在完成命令行为之前不能解除阻塞
export function Blocking<T = void, R = void>(fn: BlockingCommand<T, R>): StandardBlockingCommand<T, R> {
    return ((args) => async (context) => normalize(() => fn(context)(args))) as StandardBlockingCommand<T, R>
}

export function fork<R>(fn: GameAct<R>): ReturnType<StandardCommand<void, R>> {
    return async (context) => {
        const generator = fn(context)
        const arr = Array<Promise<unknown>>()
        while (true) {
            const { value, done } = await generator.next(context)
            if (done) return Promise.all(arr).then(() => value)
            else arr.push(value(context))
        }
    }
}

// 通过基本命令组合为宏命令,宏命令的性质由它的组成决定
export function Macro<T = void, R = void>(fn: MacroCommand<T, R>): StandardDynamicCommand<T, R> {
    return ((args) => (context) => fork((context) => fn(context)(args))(context)) as StandardDynamicCommand<T, R>
}
