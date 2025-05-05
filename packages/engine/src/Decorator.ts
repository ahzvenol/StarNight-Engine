import type {
    BlockingCommand,
    DynamicCommand,
    MacroCommand,
    NonBlockingCommand,
    StandardCommand
} from './types/Command'
import type { GameAct } from './types/Game'
import type { Function0 } from './types/Meta'
import { run } from './utils/runGenerator'

// 只在本幕内产生效果的命令,由此不需要初始化
export function ActScope<T>(fn: StandardCommand<T>): StandardCommand<T> {
    return (args) => async (context) => {
        if (!context.state.isInitializing()) return fn(args)(context)
    }
}

// 只在执行过程中产生效果的命令,这样的命令应当也是ActScope的
export function EffectScope<T>(fn: StandardCommand<T>): StandardCommand<T> {
    return (args) => async (context) => {
        if (!context.state.isInitializing() && !context.state.isFast()) return fn(args)(context)
    }
}

// 不产生任何效果的虚拟命令
export function VirtualScope<T>(): StandardCommand<T> {
    return () => async () => {}
}

// 辅助函数,标准化命令输出以方便下一环节处理
function normalize(output: Function0<unknown>): Promise<unknown> {
    return new Promise((res) => res(output())).catch((error) => console.error('命令运行出错:', error))
}

// 具有一定的执行时间,但也可以立即完成命令行为,由引擎调度是否阻塞的动态命令
export function Dynamic<T = void>(fn: DynamicCommand<T>): StandardCommand<T> {
    return (args) => (context) => {
        const { onActRush: rush, onGameStop: stop } = context
        const generator = fn(context)(args)
        return normalize(() => run(generator, { rush, stop }))
    }
}

// 默认阻塞的动态命令
export function DynamicBlocking<T = void>(fn: DynamicCommand<T>): StandardCommand<T> {
    return (args) => (context) => {
        const { onActRush: rush, onGameStop: stop } = context
        const generator = fn(context)(args)
        return normalize(() => run(generator, { rush, stop }))
    }
}

// 没有有意义的执行时间,所以也不能产生任何阻塞的命令
export function NonBlocking<T = void>(fn: NonBlockingCommand<T>): StandardCommand<T> {
    return (args) => (context) => normalize(() => fn(context)(args))
}

// 需要等待用户输入的命令,在完成命令行为之前不能解除阻塞
export function Blocking<T = void>(fn: BlockingCommand<T>): StandardCommand<T> {
    return (args) => (context) => normalize(() => fn(context)(args))
}

export function fork(fn: GameAct): ReturnType<StandardCommand<unknown>> {
    return async (context) => {
        const generator = fn(context)
        const arr = Array<Promise<unknown>>()
        while (true) {
            const { value, done } = await generator.next(context)
            if (done) return Promise.all(arr)
            else arr.push(value(context))
        }
    }
}

// 通过基本命令组合为宏命令,宏命令的性质由它的组成决定
export function Macro<T = void>(fn: MacroCommand<T>): StandardCommand<T> {
    return (args) => (context) => fork((context) => fn(context)(args))(context)
}
