import type { FilterBlockingCommands, FilterNonBlockingCommands } from '../../scripts/index'
import * as 中文命令集合 from './api'

declare global {
    const $: FilterNonBlockingCommands<typeof 中文命令集合>
    const $$: FilterBlockingCommands<typeof 中文命令集合>
}

// 挂载命令到window,让剧本文件可以直接使用而无需import
Object.assign(window, { $: 中文命令集合, $$: 中文命令集合 })
