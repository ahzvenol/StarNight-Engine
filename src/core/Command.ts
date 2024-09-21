import { IndividualSaveData } from "@/store/default"
import { Reactive } from "micro-reactive"
import { Timer } from "./Timer"
import { Variables } from "./Core"

export enum State {
    Init,
    Normal,
    Fast,
    Auto
}

export type GameContext = {
    stage: createjs.Stage
    variables: Variables,
    save: {
        global: Reactive<Record<string, any>>,
        individual: IndividualSaveData
    }
}

export type GameRuntimeContext = {
    timer: Timer,
    state: State,
    row: number,
} & GameContext

export declare const commands: Record<string, Command>

export type Args = {
    name: string,
    target: string | number,
    file: string
    duration: number,
    transition: string,
    text: string,
    number: number,
    bool: boolean
    value: string | number | boolean
}

type CommandOutput = void | (Record<string, any> & Partial<{ 'continue': boolean, 'jump': number, 'end': boolean }>)

export type CommandRunFunction<T = any> = Function1<
    GameRuntimeContext,
    Function1<
        T,
        Promise<CommandOutput> | CommandOutput
    >
>

export type CommandLifeCycleFunction = Function1<GameContext, void>

export interface Command {
    run: CommandRunFunction,
    init?: CommandRunFunction,
    beforeInit?: CommandLifeCycleFunction
    afterInit?: CommandLifeCycleFunction
    onActStart?: CommandLifeCycleFunction
}