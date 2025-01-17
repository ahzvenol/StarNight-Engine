import type { RuntimeCommandLike } from './types/Command'
import { isString } from 'es-toolkit'
import book from '@/store/book'
import { preloadResource } from './utils/preload'

// 基于命名约定的预加载,搜索所有名称为file的参数
export function preloadByNamingConvention(rows: Array<RuntimeCommandLike>) {
    rows.forEach((row) => {
        if (Array.isArray(row.args)) preloadByNamingConvention(row.args)
        else
            Object.entries(row.args)
                .filter(([key]) => key === 'file')
                .map((kv) => kv[1])
                .filter((value) => isString(value))
                .forEach((value) => preloadResource(value))
    })
}

export async function preloadWithIndex(index: number) {
    if (index >= (await book.length())) return
    const rows = await book.full(index)
    preloadByNamingConvention(rows)
}
