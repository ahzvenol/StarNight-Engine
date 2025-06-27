import type { FilterBlockingCommands, FilterNonBlockingCommands } from '../../index'
import * as 中文命令集合 from './api'

declare global {
    const $执行: FilterNonBlockingCommands<typeof 中文命令集合>
    const $等待: FilterBlockingCommands<typeof 中文命令集合>
}

Object.assign(window, { $执行: 中文命令集合, $等待: 中文命令集合 })
