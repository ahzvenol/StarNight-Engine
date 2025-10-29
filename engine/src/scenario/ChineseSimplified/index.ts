import type { FilterBlockingCommands, FilterDynamicCommands, FilterNonBlockingCommands } from '../../scripts/index'
import * as 中文命令集合 from './api'

type 中文命令集合类型 = typeof 中文命令集合

declare global {
    const $: FilterNonBlockingCommands<中文命令集合类型> & FilterDynamicCommands<中文命令集合类型>
    const $$: FilterBlockingCommands<中文命令集合类型> & FilterDynamicCommands<中文命令集合类型>
}

// 挂载命令到window,让剧本文件可以直接使用而无需import
Object.assign(window, { $: 中文命令集合, $$: 中文命令集合 })
