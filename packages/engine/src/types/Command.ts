import type { Signal } from 'micro-reactive-wrapper'
import type { GameRuntimeContext, GameState } from './Game'
import type { Function0, Function1, MetaFunction, NeverFailingPromise } from './Meta'

// 命令参数可能的类型
export type CommandArg = string | number | boolean

// 命令参数体
export type CommandArgs = Partial<Record<string, CommandArg>> | Array<CommandRow>

// 命令数据块
export type CommandRow = { key: string; args: CommandArgs }

// 会在幕循环中被处理的特殊值
export type CommandOutput = {
    cont: Signal<boolean>
    jump: Signal<number | string | undefined>
    end: Signal<boolean>
    state: Signal<GameState | undefined>
}

// 使用生成器函数定义一个耗时无阻塞命令
export type DynamicCommandFunction<T extends CommandArgs> = Function1<
    GameRuntimeContext,
    Function1<T, Generator<Promise<unknown>, unknown, void>>
>

// 使用普通函数定义一个不耗时无阻塞命令
export type NonBlockingCommandFunction<T extends CommandArgs> = Function1<GameRuntimeContext, Function1<T, unknown>>

// 使用异步函数定义一个耗时阻塞命令
export type BlockingCommandFunction<T extends CommandArgs> = Function1<
    GameRuntimeContext,
    Function1<T, Promise<unknown>>
>

// 在命令的类型声明中定义的应该是命令需要的参数
// 因为命令实际可能接收到的参数是any,而参数校验目前未实现
export type CommandFunction<T extends CommandArgs> =
    | DynamicCommandFunction<T>
    | NonBlockingCommandFunction<T>
    | BlockingCommandFunction<T>

// Resolved命令已经传入全部参数
export type ResolvedCommandFunction = Function0<unknown>

// 具有Resolved和Standard性质的命令
export type StandardResolvedCommandFunction = Function0<NeverFailingPromise<unknown>>

// 使用这两个标记的目的是使用外部数据对象控制程序的阻塞/并行调度
export enum Schedule {
    Await = 'await',
    Async = 'async'
}

// 标准命令返回一个永不失败的Promise
export type StandardCommandFunction<T extends CommandArgs> = Function1<
    GameRuntimeContext,
    Function1<T, NeverFailingPromise<unknown>>
>

// 高阶命令最终映射到基本命令,基本命令已进行异常处理,所以高阶命令无需再处理异常
// 高阶命令只进行多个基本命令之间的调度,基本命令的耗时和阻塞控制由自身的定义决定
export type HighLevelCommandFunction = StandardCommandFunction<Array<CommandEntities>>

// 附加了作用域标志的标准命令
// 命令作用域用于优化运行效率
export interface StandardCommand<T extends CommandArgs> extends MetaFunction {
    meta?: { schedule?: Schedule; exclude?: Partial<Record<GameState, undefined>> }
    apply: StandardCommandFunction<T>
}

// 附加了作用域标志的高阶命令
export interface ScheduledHighLevelCommand extends MetaFunction {
    meta?: { schedule?: Schedule; exclude?: Partial<Record<GameState, undefined>> }
    apply: HighLevelCommandFunction
}

export interface ScheduledStandardResolvedCommand extends MetaFunction {
    meta: { schedule: Schedule }
    apply: StandardResolvedCommandFunction
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Command = StandardCommand<any> | ScheduledHighLevelCommand

// ----

export type Commands = Record<string, Command>
// 已注册的全部命令
// export type Commands = ReturnType<typeof commands>

// 已注册的全部命令对应的标志
export type CommandsKeys = keyof Commands

// 运行时的输入数据,其中命令可能不存在,命令参数可能非法
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RuntimeCommandLike = { readonly key: string; readonly args: any }

// 已注册的全部命令的参数定义,使用标志取出
export type CommandsArgs<T extends CommandsKeys> = Parameters<ReturnType<Commands[T]['apply']>>[0]

// 程序宏使用,产生一个类型安全的命令数据块
export type CommandEntity<T extends CommandsKeys> = {
    [K in CommandsKeys]: {
        readonly condition?: Function1<GameRuntimeContext, Function1<CommandsArgs<K>, boolean>>
        readonly key: K
        readonly await?: true
        readonly args: CommandsArgs<K>
    }
}[T]

// 所有可能的类型安全的命令数据块
export type CommandEntities = CommandEntity<CommandsKeys>

// 运行时已初步过滤的数据,其中命令一定存在,命令参数可能非法
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RuntimeCommandEntity<T extends CommandsKeys> = { readonly key: T; readonly args: any }

export type RuntimeCommandEntities = RuntimeCommandEntity<CommandsKeys>

export type ExtendArgs<T> = Partial<{ [K in keyof T]: T[K] & CommandArg }>
