import type { RuntimeCommandLike } from '@/core/types/Command'
import { cloneDeep, merge } from 'es-toolkit'
import { fullConvert } from '@/core/convert'
import request from '@/utils/request'

type Book = Array<Array<RuntimeCommandLike>>

const book = request<Book>('./static/book.json').then((res) => res.data)

const signs = book.then((res) =>
    res
        .map((act) => act.filter((item) => item.key === 'sign'))
        .flatMap((act, index) => (act.length === 0 ? [] : [{ [act[0]['args']['name']]: index }]))
        .reduce<Record<string, number>>(merge, {})
)

const length = () => book.then((res) => res.length)

const act = (index: number) => book.then((res) => cloneDeep(res[index]))

const full = (index: number) => act(index).then(fullConvert)

const sign = (sign: string) => signs.then((map) => map[sign])

export default { act, full, sign, length }
