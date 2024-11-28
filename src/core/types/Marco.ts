import type { macros } from '../commands/macro'
import type { CommandArgs, CommandEntity, CommandsKeys } from './Command'

export type MacroAble = {
    [K in CommandsKeys]: CommandEntity<K>
}[CommandsKeys]
// 循环引用
// | {
//       [K in MacrosKeys]: CommandEntity<K>
//   }[MacrosKeys]

export class MacroCommandEntity<T extends MacrosKeys> {
    private constructor(
        public readonly sign: T,
        public readonly args: MacrosArgs<T>
    ) {}
    static from<T extends MacrosKeys>(sign: T, args: MacrosArgs<T>): MacroCommandEntity<T> {
        return new MacroCommandEntity(sign, args)
    }
}

export type MacroFunction<T extends CommandArgs = CommandArgs> = Function1<T, Array<MacroAble>>

export class MacroEntity<T extends string, R extends CommandArgs = CommandArgs> {
    constructor(
        public readonly sign: T,
        public readonly apply: MacroFunction<R>
    ) {}
    static from<T extends string, R extends CommandArgs = CommandArgs>(
        sign: T,
        apply: MacroFunction<R>
    ): MacroEntity<T, R> {
        return new MacroEntity(sign, apply)
    }
}

export type Macros = (typeof macros)[number]

export type MacrosKeys = Macros['sign']

export type MacrosArgs<T extends MacrosKeys> = Parameters<Extract<Macros, { sign: T }>['apply']>[0]
