import type { GameAct } from './types/Game'

export abstract class AbstractGameBook {
    abstract length(): number

    abstract act(index: number): GameAct<unknown>

    abstract label(label: string): number
}
