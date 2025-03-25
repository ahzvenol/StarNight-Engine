import type { RuntimeCommandLike } from './types/Command'
import { isPlainObject, isString } from 'es-toolkit'
import { onSetupBook } from './event'
import { preloadResource } from './utils/preload'

// 基于命名约定的预加载,搜索所有名称为file的参数
export function preloadByNamingConvention(rows: Array<RuntimeCommandLike>) {
    rows.forEach((row) => {
        if (Array.isArray(row.args)) {
            preloadByNamingConvention(row.args)
        } else if (isPlainObject(row.args)) {
            Object.entries(row.args)
                .filter(([key]) => key === 'file')
                .map((kv) => kv[1])
                .filter((value) => isString(value))
                .forEach((value) => preloadResource(value))
        }
    })
}

export async function preloadWithIndex(index: number) {
    if (index < (await (await onSetupBook).length())) {
        const rows = await (await onSetupBook).act(index)
        preloadByNamingConvention(rows)
    }
}
