import type { RuntimeCommandEntitys } from '@/core/types/Command'
import type { GameBook } from '@/core/types/Game'
import { cloneDeep, merge } from 'es-toolkit'
import { convertCommands } from '@/core/convert'
import { resource } from '@/utils/request'

const _book = resource<GameBook>('./book.json').then((res) => res.data)

const _length = _book.then((res) => res.length)

const _full = _book.then((res) => res.map(convertCommands))

// const _flat = _full.then((res) => res.map(flattenCommands))

const _label = _full.then((res) =>
    res
        .map((act) => act.filter((item) => item.key === 'label'))
        .flatMap((act, index) => (act.length === 0 ? [] : [{ [act[0]['args']['name']]: index }]))
        .reduce<Record<string, number>>(merge, {})
)

function length(): Promise<number> {
    return _length
}

function act(index: number): Promise<Array<RuntimeCommandEntitys>> {
    return _full.then((res) => cloneDeep(res[index]))
}

// function flat(index: number): Promise<Array<RuntimeCommandLike>> {
//     return _flat.then((res) => cloneDeep(res[index]))
// }

function label(sign: string): Promise<number> {
    return _label.then((map) => map[sign])
}

export default { act, label, length }
