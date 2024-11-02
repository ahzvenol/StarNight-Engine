import { cloneDeep } from 'es-toolkit'
import request from '@/utils/request'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const book = request('./static/book.json').then((res) => res.data as Array<Array<Record<string, any>>>)

const length = async () => (await book).length

const row = (index: number) => book.then((res) => cloneDeep(res[index]))

export default { row, length }
