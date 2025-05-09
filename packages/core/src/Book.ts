import type { GameAct } from './types/Game'

export interface AbstractGameBook {
    length(): number

    act(index: number): GameAct<unknown>

    label(label: string): number
}
