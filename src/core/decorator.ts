import type {
    BlockingCommandFunction,
    CommandArgs,
    CommandOutput,
    DynamicCommandFunction,
    NonBlockingCommandFunction,
    StandardCommand
} from './types/Command'
import { isPlainObject, merge } from 'es-toolkit'
import { log } from '@/utils/logger'
import { Schedule } from './types/Command'
import { GameState } from './types/Game'
import { run } from './utils/generator'

// 只在本幕内产生效果的命令,由此不需要初始化
export function ActScope<T extends CommandArgs>(cmd: StandardCommand<T>): StandardCommand<T> {
    return merge(cmd, { meta: { exclude: { [GameState.Init]: undefined } } })
}
// 只在执行过程中产生效果的命令,这样的命令应当也是ActScope的
export function EffectScope<T extends CommandArgs>(cmd: StandardCommand<T>): StandardCommand<T> {
    return merge(cmd, { meta: { exclude: { [GameState.Init]: undefined, [GameState.Fast]: undefined } } })
}

// 辅助函数,标准化命令输出以方便下一环节处理
function normalizeOutput(output: Function0<unknown>): Promise<CommandOutput> {
    return new Promise((res) => res(output()))
        .catch((error) => log.error('命令运行出错:', error))
        .then((result) => (isPlainObject(result) ? result : {}))
}

// 具有一定的执行时间,但也可以立即完成命令行为,由引擎调度是否阻塞的动态命令
export function Dynamic<T extends CommandArgs>(fn: DynamicCommandFunction<T>): StandardCommand<T> {
    return {
        meta: {},
        apply: (context) => (args) => {
            const { immediate, cleanup: cancel } = context
            const generator = fn(context)(args)
            return normalizeOutput(() => run(generator, { immediate, cancel }))
        }
    }
}

// 默认阻塞的动态命令
export function DynamicBlocking<T extends CommandArgs>(fn: DynamicCommandFunction<T>): StandardCommand<T> {
    return {
        meta: { schedule: Schedule.Await },
        apply: (context) => (args) => {
            const { immediate, cleanup: cancel } = context
            const generator = fn(context)(args)
            return normalizeOutput(() => run(generator, { immediate, cancel }))
        }
    }
}

// 没有有意义的执行时间,所以也不能产生任何阻塞的命令
export function NonBlocking<T extends CommandArgs>(fn: NonBlockingCommandFunction<T>): StandardCommand<T> {
    return {
        meta: { schedule: Schedule.Async },
        apply: (context) => (args) => normalizeOutput(() => fn(context)(args))
    }
}

// 需要等待用户输入的命令,在完成命令行为之前不能解除阻塞
export function Blocking<T extends CommandArgs>(fn: BlockingCommandFunction<T>): StandardCommand<T> {
    return {
        meta: { schedule: Schedule.Await },
        apply: (context) => (args) => normalizeOutput(() => fn(context)(args))
    }
}
