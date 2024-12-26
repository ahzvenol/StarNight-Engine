import type { macros } from '../commands/macros'
import type { CommandArgs, CommandEntitys } from './Command'

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

export type MacroAble = MacroEntitys | CommandEntitys

export interface MacroEntity<T extends MacrosKeys> {
    readonly sign: T
    readonly args: MacrosArgs<T>
}

export type MacroEntitys = MacroEntity<MacrosKeys>

export type Macros = (typeof macros)[number]

export type MacrosKeys = Macros['sign']

export type MacrosArgs<T extends MacrosKeys> = Parameters<Extract<Macros, { sign: T }>['apply']>[0]
