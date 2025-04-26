import type { Converter } from './Converter'
import type { GameBookProcessed, GameBookRaw } from './types/Game'
import type { Function0, Function1 } from './types/Meta'
import { cloneDeep, merge } from 'es-toolkit'

export abstract class AbstractGameBook {
    abstract length(): number

    abstract act(index: number): GameBookProcessed[number]

    abstract label(label: string): number
}

export class GameBook extends AbstractGameBook {
    static create = async (raw: GameBookRaw, converter: Converter): Promise<GameBook> => {
        const result = raw.map(converter.applyMacrosToCommandsNodes).map(converter.filterRealCommandsRecursively)
        const label = result
            .map((act) => act.filter((item) => item.key === 'label'))
            .flatMap((act, index) => (act.length === 0 ? [] : [{ [act[0]['args']['id']]: index }]))
            .reduce<Record<string, number>>(merge, {})

        return new GameBook(result, label)
    }

    constructor(
        readonly _result: GameBookProcessed,
        readonly _label: Record<string, number>
    ) {
        super()
    }

    length: Function0<number> = () => this._result.length

    act: Function1<number, GameBookProcessed[number]> = (index) => cloneDeep(this._result[index])

    label: Function1<string, number> = (sign) => this._label[sign]
}
