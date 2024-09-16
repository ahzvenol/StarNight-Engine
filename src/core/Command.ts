import { IndividualSaveData } from "@/store/default"
import { Reactive } from "micro-reactive"
import { Timer } from "./Timer"

export enum State {
    Init,
    Normal,
    Fast,
    Auto
}

export type GameContext = {
    timer: Timer,
    state: State,
    row: number,
    stage: createjs.Stage
    variables: Reactive<Dictionary>,
    save: {
        global: Reactive<Dictionary>,
        individual: IndividualSaveData
    }
}

export declare const commands: Dictionary<Command | ActScopedCommand | GameScopedCommand>

type ArgsType = {
    name: string,
    target: string,
    duration: number,
    transition: string
}

// tag:要实现代码提示,但是实际上又不一定存在这个参数,为了避免代码里到处都是!,暂时先把类型写怪一点
export type CommandRunFunction = Function1<
    GameContext,
    Function1<
        Dictionary & Partial<ArgsType> & ArgsType,
        Promise<void | any> | void
    >
>

export interface Command {
    run: CommandRunFunction
}

export interface ActScopedCommand extends Command {
    onActStart: Function0<void>
}

export interface GameScopedCommand extends Command {
    afterInit: Function0<void>
}