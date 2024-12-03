import { cloneDeep } from 'es-toolkit'
import request from '@/utils/request'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Book = Array<Array<Record<string, any>>>

const book = request<Book>('./static/book.json').then((res) => res.data)

const length = () => book.then((res) => res.length)

const row = (index: number) => book.then((res) => cloneDeep(res[index]))

export default { row, length }
