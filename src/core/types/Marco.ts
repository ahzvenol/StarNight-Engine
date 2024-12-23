import type { macros } from '../commands/macros'
import type { CommandArgs, CommandEntity, CommandsKeys } from './Command'

export type MacroAble = {
    [K in CommandsKeys]: CommandEntity<K>
}[CommandsKeys]
// 循环引用
// | {
//       [K in MacrosKeys]: CommandEntity<K>
//   }[MacrosKeys]

export class MacroEntity<T extends MacrosKeys> {
    private constructor(
        public readonly sign: T,
        public readonly args: MacrosArgs<T>
    ) {}
    static from<T extends MacrosKeys>(sign: T, args: MacrosArgs<T>): MacroEntity<T> {
        return new MacroEntity(sign, args)
    }
}

export type MacroFunction<T extends CommandArgs = CommandArgs> = Function1<T, Array<MacroAble>>

export class Macro<T extends string, R extends CommandArgs = CommandArgs> {
    constructor(
        public readonly sign: T,
        public readonly apply: MacroFunction<R>
    ) {}
    static from<T extends string, R extends CommandArgs = CommandArgs>(sign: T, apply: MacroFunction<R>): Macro<T, R> {
        return new Macro(sign, apply)
    }
}

export type Macros = (typeof macros)[number]

export type MacrosKeys = Macros['sign']

export type MacrosArgs<T extends MacrosKeys> = Parameters<Extract<Macros, { sign: T }>['apply']>[0]

export interface MetaFunction {
    meta: Record<string, unknown>
    apply: Function
}
