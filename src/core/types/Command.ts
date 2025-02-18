import type { Scope } from '@/core/types/Command'
import type { commands } from '../commands'
import type { GameRuntimeContext } from './Game'
import type { MetaFunction, NeverFailingPromise } from './Meta'
import { GameState } from './Game'

// 命令参数可能的类型
export type CommandArg = string | number | boolean

// 命令参数体
export type CommandArgs = Partial<Record<string, CommandArg>> | Array<CommandRow>

// 命令数据块
export type CommandRow = { key: string; args: CommandArgs }

// 会在幕循环中被处理的特殊值
export interface CommandOutput {
    continue?: boolean
    jump?: number
    end?: boolean
    state?: GameState
}

// 实际上命令可以返回任何值,但是只有CommandOutput有意义
export type RuntimeCommandOutput = unknown | CommandOutput

// 使用生成器函数定义一个耗时无阻塞命令
export type DynamicCommandFunction<T extends CommandArgs> = Function1<
    GameRuntimeContext,
    Function1<T, Generator<Promise<unknown>, RuntimeCommandOutput, void>>
>

// 使用普通函数定义一个不耗时无阻塞命令
export type NonBlockingCommandFunction<T extends CommandArgs> = Function1<
    GameRuntimeContext,
    Function1<T, RuntimeCommandOutput>
>

// 使用异步函数定义一个耗时阻塞命令
export type BlockingCommandFunction<T extends CommandArgs> = Function1<
    GameRuntimeContext,
    Function1<T, Promise<RuntimeCommandOutput>>
>

// 在命令的类型声明中定义的应该是命令需要的参数
// 因为命令实际可能接收到的参数是any,而参数校验目前未实现
export type CommandFunction<T extends CommandArgs> =
    | DynamicCommandFunction<T>
    | NonBlockingCommandFunction<T>
    | BlockingCommandFunction<T>

// Resolved命令已经传入全部参数
export type ResolvedCommandFunction = Function0<RuntimeCommandOutput>

// 具有Resolved和Standard性质的命令
export type StandardResolvedCommandFunction = Function0<NeverFailingPromise<CommandOutput>>

// 使用这两个标记的目的是使用外部数据对象控制程序的阻塞/并行调度
export enum Schedule {
    Await = 'await',
    Async = 'async'
}

// 命令作用域用于优化运行效率
export { GameState as Scope }

// 标准命令返回一个永不失败的Promise
export type StandardCommandFunction<T extends CommandArgs> = Function1<
    GameRuntimeContext,
    Function1<T, NeverFailingPromise<CommandOutput>>
>

export type StandardCommandFunction0<T extends CommandArgs> = Function0<
    Function1<T, NeverFailingPromise<CommandOutput>>
>

// 高阶命令最终映射到基本命令,基本命令已进行异常处理,所以高阶命令无需再处理异常
// 高阶命令只进行多个基本命令之间的调度,基本命令的耗时和阻塞控制由自身的定义决定
export type HighLevelCommandFunction = StandardCommandFunction<Array<CommandEntitys>>

// 附加了作用域标志的标准命令
export interface StandardCommand<T extends CommandArgs> extends MetaFunction {
    meta?: { schedule?: Schedule; exclude?: Partial<Record<Scope, undefined>> }
    apply: StandardCommandFunction<T>
}

// 显式不需要Context的命令,临时解决方案,方便命令间互相调用
export interface StandardCommand0<T extends CommandArgs> extends MetaFunction {
    meta?: { schedule?: Schedule; exclude?: Partial<Record<Scope, undefined>> }
    apply: StandardCommandFunction0<T>
}

// 附加了作用域标志的高阶命令
export interface ScheduledHighLevelCommand extends MetaFunction {
    meta?: { schedule?: Schedule; exclude?: Partial<Record<Scope, undefined>> }
    apply: HighLevelCommandFunction
}

export interface ScheduledStandardResolvedCommand extends MetaFunction {
    meta: { schedule: Schedule }
    apply: StandardResolvedCommandFunction
}

// 已注册的全部命令
export type Commands = ReturnType<typeof commands>

// 已注册的全部命令对应的标志
export type CommandsKeys = keyof Commands

// ----

// 运行时的输入数据,其中命令可能不存在,命令参数可能非法
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RuntimeCommandLike = { readonly key: string; readonly args: any }

// 已注册的全部命令的参数定义,使用标志取出
export type CommandsArgs<T extends CommandsKeys> = Parameters<ReturnType<Commands[T]['apply']>>[0]

// 程序宏使用,产生一个类型安全的命令数据块
export type CommandEntity<T extends CommandsKeys> = {
    [K in CommandsKeys]: {
        readonly key: K
        readonly await?: true
        readonly if?: Function1<GameRuntimeContext, boolean>
        readonly args: CommandsArgs<K>
    }
}[T]

// 所有可能的类型安全的命令数据块
export type CommandEntitys = CommandEntity<CommandsKeys>

// 运行时已初步过滤的数据,其中命令一定存在,命令参数可能非法
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RuntimeCommandEntity<T extends CommandsKeys> = { readonly key: T; readonly args: any }

export type RuntimeCommandEntitys = RuntimeCommandEntity<CommandsKeys>

export type ExtendArgs<T> = Partial<{ [K in keyof T]: T[K] & CommandArg }>
