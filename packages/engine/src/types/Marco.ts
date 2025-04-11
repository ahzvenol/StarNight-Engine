import type { CommandArgs, CommandEntities } from './Command'
import type { Function1 } from './Meta'

// 程序宏输入一个宏命令数据块,输出一组类型安全的命令数据块,其中可能包括普通命令和宏命令
export type MacroFunction<T extends CommandArgs> = Function1<T, Array<MacroOutput>>

// 程序宏的注册结构体,因为宏可能同名,不能使用对象键
export class Macro<T extends string = string, R extends CommandArgs = CommandArgs> {
    constructor(
        public readonly key: T,
        public readonly apply: MacroFunction<R>
    ) {}
    static from<T extends string, R extends CommandArgs>(key: T, apply: MacroFunction<R>): Macro<T, R> {
        return new Macro(key, apply)
    }
}

export type MacroOutput = MacroEntities | CommandEntities

// ----

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Macros = Array<Macro<string, any>>
// 已注册的全部程序宏
// export type Macros = typeof macros

// 程序宏使用,产生一个类型安全的宏命令数据块
export type MacroEntity<T extends MacrosKeys> = {
    readonly key: T
    readonly await?: true
    readonly args: MacrosArgs<T>
}

// 所有可能的类型安全的宏命令数据块
export type MacroEntities = MacroEntity<MacrosKeys>

// 已注册的全部程序宏对应的标志
export type MacrosKeys = Macros[number]['key']

// 已注册的全部程序宏的参数定义,使用标志取出
export type MacrosArgs<T extends MacrosKeys> = Parameters<Extract<Macros[number], { key: T }>['apply']>[0]
