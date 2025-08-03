import type {
    BlockingCommand,
    DynamicCommand,
    MacroCommand,
    NonBlockingCommand,
    StandardBlockingCommand,
    StandardCommand,
    StandardDynamicCommand,
    StandardNonBlockingCommand,
    StandardResolvedCommand
} from './types/Command'
import type { GameFragment } from './types/Game'
import { noop } from 'es-toolkit'

/**
 * 只在本幕内产生效果的命令，由此不需要初始化。
 */
export function ActScope<T, R>(fn: StandardDynamicCommand<T, R>): StandardDynamicCommand<T, R | void>
export function ActScope<T, R>(fn: StandardNonBlockingCommand<T, R>): StandardNonBlockingCommand<T, R | void>
export function ActScope<T, R>(fn: StandardBlockingCommand<T, R>): StandardBlockingCommand<T, R | void>
export function ActScope<T, R>(fn: StandardCommand<T, R>): StandardCommand<T, R | void> {
    return (args) => async (context) => {
        if (!context.state.isInitializing()) return fn(args)(context)
    }
}

/**
 * 只在执行过程中产生效果的命令，这样的命令应当也是 ActScope 的。
 */
export function EffectScope<T, R>(fn: StandardDynamicCommand<T, R>): StandardDynamicCommand<T, R | void>
export function EffectScope<T, R>(fn: StandardNonBlockingCommand<T, R>): StandardNonBlockingCommand<T, R | void>
export function EffectScope<T, R>(fn: StandardBlockingCommand<T, R>): StandardBlockingCommand<T, R | void>
export function EffectScope<T, R>(fn: StandardCommand<T, R>): StandardCommand<T, R | void> {
    return (args) => async (context) => {
        if (!context.state.isInitializing() && !context.state.isFast()) return fn(args)(context)
    }
}

/**
 * 不产生任何效果的虚拟命令。
 */
export function VirtualScope<T>(): StandardCommand<T, void> {
    return () => async () => {}
}

// 辅助函数,标准化命令输出以方便下一环节处理
function normalize<R>(output: Function0<R>): Promise<R> {
    return new Promise((res) => res(output())).catch((error) => console.error('命令运行出错:', error)) as Promise<R>
}

// Dynamic核心函数,实现了同步/异步转换
async function runGenerator<TRetrun>(
    generator: Generator<Promise<unknown>, TRetrun, void>,
    { rush, stop }: { rush: Promise<unknown>, stop: Promise<unknown> }
): Promise<TRetrun | undefined> {
    let flag: 'Normal' | 'Rush' | 'Stop' = 'Normal'

    while (true) {
        // 释放阻塞可能导致接下来的命令执行
        if (flag === 'Stop') return new Promise(noop)
        const { value, done } = generator.next()
        if (!done) {
            if (flag !== 'Rush') {
                flag = await Promise.race([
                    value.then(() => 'Normal' as const),
                    rush.then(() => 'Rush' as const),
                    stop.then(() => 'Stop' as const)
                ])
            }
        } else return value
    }
}

/**
 * 具有一定的执行时间，但也可以立即完成命令行为，由引擎调度是否阻塞的动态命令。
 */
export function Dynamic<T = void, R = void>(fn: DynamicCommand<T, R>): StandardDynamicCommand<T, R> {
    return ((args) => async (context) => {
        const { onActRush: rush, onGameStop: stop } = context
        const generator = fn(context)(args)
        return normalize(() => runGenerator(generator, { rush, stop })) as Promise<R>
    }) as StandardDynamicCommand<T, R>
}

/**
 * 默认阻塞的动态命令，相当于借由引擎调度解除阻塞的 Blocking 命令。
 */
export function DynamicBlocking<T = void, R = void>(fn: DynamicCommand<T, R>): StandardBlockingCommand<T, R> {
    return ((args) => async (context) => {
        const { onActRush: rush, onGameStop: stop } = context
        const generator = fn(context)(args)
        return normalize(() => runGenerator(generator, { rush, stop })) as Promise<R>
    }) as StandardBlockingCommand<T, R>
}

/**
 * 没有有意义的执行时间，所以也不能产生任何阻塞的命令。
 */
export function NonBlocking<T = void, R = void>(fn: NonBlockingCommand<T, R>): StandardNonBlockingCommand<T, R> {
    return ((args) => async (context) => normalize(() => fn(context)(args))) as StandardNonBlockingCommand<T, R>
}

/**
 * 需要等待用户输入的命令，在完成命令行为之前不能解除阻塞。
 */
export function Blocking<T = void, R = void>(fn: BlockingCommand<T, R>): StandardBlockingCommand<T, R> {
    return ((args) => async (context) => normalize(() => fn(context)(args))) as StandardBlockingCommand<T, R>
}

/**
 * 解析生成器到 Resolved 命令，在 yield Promise 前是同步的。
 * - 如果 yield Promise，等待 Promise 解析并返回 Promise 内部的值。
 * - 如果 yield Function，传入 Context 作为函数参数，执行并返回函数的返回值。
 * - 如果 yield 其他数据，直接返回该数据。
 */
export function Fork<R>(fn: GameFragment<R>): StandardResolvedCommand<R> {
    return async (context) => {
        const generator = fn(context)
        const arr = Array<unknown>()
        while (true) {
            const { value, done } = generator.next(arr.slice(-1)[0])
            if (value instanceof Promise) arr.push(await value)
            else if (done) return Promise.all(arr).then(() => value)
            else if (value instanceof Function) arr.push(value(context))
            else arr.push(value)
        }
    }
}

// 通过基本命令组合为宏命令，宏命令的性质由它的组成决定。
/**
 * 由 NonBlocking 和 Dynamic 参与组成的宏可以作为 Dynamic 的。
 */
export function DynamicMacro<T = void, R = void>(fn: MacroCommand<T, R>): StandardDynamicCommand<T, R> {
    return ((args) => (context) => Fork((context) => fn(context)(args))(context)) as StandardDynamicCommand<T, R>
}

/**
 * 由 NonBlocking 和 Dynamic 参与组成的宏可以作为 NonBlocking 的。
 */
export function NonBlockingMacro<T = void, R = void>(fn: MacroCommand<T, R>): StandardNonBlockingCommand<T, R> {
    return ((args) => (context) => Fork((context) => fn(context)(args))(context)) as StandardNonBlockingCommand<T, R>
}

/**
 * 由 Blocking 命令参与组成的宏应该也是 Blocking 的。
 */
export function BlockingMacro<T = void, R = void>(fn: MacroCommand<T, R>): StandardBlockingCommand<T, R> {
    return ((args) => (context) => Fork((context) => fn(context)(args))(context)) as StandardBlockingCommand<T, R>
}
