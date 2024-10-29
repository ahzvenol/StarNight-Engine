import request from '@/utils/request'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const book = request('./static/book.json').then((res) => res.data as Array<Array<Record<string, any>>>)
