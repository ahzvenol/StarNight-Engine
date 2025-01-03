import type { commands } from '../commands'
import type { GameRuntimeContext } from './Game'
import type { MetaFunction } from './Meta'
import type { NeverFailingPromise, Schedule } from './Schedule'

// 命令参数可能的类型
export type CommandArg = string | number | boolean

// 一个独立的命令数据块,@是命令标志位,@@是高阶命令包含的命令集合
export type CommandRow = Partial<Record<string, CommandArg>> & { '@': string } & { '@@'?: Array<CommandRow> }

// 去掉了命令标志位后的命令参数体
export type CommandArgs = Omit<CommandRow, '@'> | Array<CommandRow>

// 会在幕循环中被处理的特殊值
export interface CommandOutput {
    continue?: boolean
    jump?: number
    end?: boolean
    endAuto?: Promise<void>
}

// 实际上命令可以返回任何值,但是只有CommandOutput有意义
export type RuntimeCommandOutput = unknown | CommandOutput

// 如果命令没有达到执行条件,可能什么都不做,所有什么都不返回
export type SocpedCommandFunction<T extends CommandArgs> = Function1<GameRuntimeContext, Function1<T, undefined>>

// 使用生成器函数定义一个耗时无阻塞命令
export type DynamicCommandFunction<T extends CommandArgs> = Function1<
    GameRuntimeContext,
    Function1<T, Generator<Promise<void>, RuntimeCommandOutput, void>>
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

export type CommandFunction<T extends CommandArgs> =
    | SocpedCommandFunction<T>
    | DynamicCommandFunction<T>
    | NonBlockingCommandFunction<T>
    | BlockingCommandFunction<T>

// Standard命令返回一个永不失败的Promise
export type StandardCommandFunction<T extends CommandArgs> = Function1<
    GameRuntimeContext,
    Function1<T, NeverFailingPromise<CommandOutput>>
>

// 附加了阻塞/并行调度标志的标准命令
export interface StandardCommand<T extends CommandArgs> extends MetaFunction {
    meta: { schedule: Schedule }
    apply: StandardCommandFunction<T>
}

// 已注册的全部命令
export type Commands = typeof commands

// 已注册的全部命令对应的标志
export type CommandsKeys = keyof Commands

// ----

// 运行时的输入数据,其中命令可能不存在,命令参数可能非法
export type RuntimeCommandLike = {
    readonly sign: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly args: any
}

// 已注册的全部命令的参数定义,使用标志取出
export type CommandsArgs<T extends CommandsKeys> = Parameters<ReturnType<Commands[T]['apply']>>[0]

// 程序宏使用,产生一个类型安全的命令数据块
export interface CommandEntity<T extends CommandsKeys> {
    readonly sign: T
    readonly args: CommandsArgs<T>
}

// 所有可能的类型安全的命令数据块
export type CommandEntitys = CommandEntity<CommandsKeys>

// 运行时已初步过滤的数据,其中命令一定存在,命令参数可能非法
export interface RuntimeCommandEntity<T extends CommandsKeys> {
    readonly sign: T
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly args: any
}

export type RuntimeCommandEntitys = RuntimeCommandEntity<CommandsKeys>
