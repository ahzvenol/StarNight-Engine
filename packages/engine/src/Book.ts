import { cloneDeep, merge } from 'es-toolkit'
import { Converter } from './Converter'
import { GameBookProcessed, GameBookRaw } from './types/Game'
import { Function0, Function1 } from './types/Meta'

export class GameBook {
    static create = async (raw: GameBookRaw, converter: Converter): Promise<GameBook> => {
        const result = raw.map(converter.applyMacrosToCommandsNodes).map(converter.filterRealCommandsRecursively)
        const label = result
            .map((act) => act.filter((item) => item.key === 'label'))
            .flatMap((act, index) => (act.length === 0 ? [] : [{ [act[0]['args']['name']]: index }]))
            .reduce<Record<string, number>>(merge, {})

        return new GameBook(result, label)
    }

    constructor(
        readonly _result: GameBookProcessed,
        readonly _label: Record<string, number>
    ) {}

    length: Function0<number> = () => this._result.length

    act: Function1<number, GameBookProcessed[number]> = (index) => cloneDeep(this._result[index])

    label: Function1<string, number> = (sign) => this._label[sign]
}
