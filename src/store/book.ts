import type { RuntimeCommandLike } from '@/core/types/Command'
import { cloneDeep, merge } from 'es-toolkit'
import { convertCommands, flattenCommands } from '@/core/convert'
import { resource } from '@/utils/request'

type Book = Array<Array<RuntimeCommandLike>>

const book = resource<Book>('./static/book.json').then((res) => res.data)

const _length = book.then((res) => res.length)

const _sign = book.then((res) =>
    res
        .map((act) => act.filter((item) => item.key === 'sign'))
        .flatMap((act, index) => (act.length === 0 ? [] : [{ [act[0]['args']['name']]: index }]))
        .reduce<Record<string, number>>(merge, {})
)

const _full = book.then((res) => res.map(convertCommands))

const _flat = _full.then((res) => res.map(flattenCommands))

async function length() {
    return _length
}

async function act(index: number) {
    return book.then((res) => cloneDeep(res[index]))
}

async function full(index: number) {
    return _full.then((res) => cloneDeep(res[index]))
}

async function flat(index: number) {
    return _flat.then((res) => cloneDeep(res[index]))
}

async function sign(sign: string) {
    return _sign.then((map) => map[sign])
}

export default { act, full, flat, sign, length }
