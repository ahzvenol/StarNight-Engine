import type { RuntimeCommandLike } from '@/core/types/Command'
import { cloneDeep } from 'es-toolkit'
import request from '@/utils/request'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Book = Array<Array<RuntimeCommandLike>>

const book = request<Book>('./static/book.json').then((res) => res.data)

const length = () => book.then((res) => res.length)

const act = (index: number) => book.then((res) => cloneDeep(res[index]))

export default { act, length }
