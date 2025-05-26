import type { GameFragment } from './types/Game'

export interface AbstractGameBook {
    length(): number

    act(index: number): GameFragment<unknown>

    label(label: string): number
}
