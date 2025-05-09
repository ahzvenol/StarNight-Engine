import type { Store } from './default'
import { toMerged } from 'es-toolkit'
import { SystemDefaultStore } from './default'

const Custom: Partial<Store> = {}

export const CustomDefaultStore = async () => toMerged(SystemDefaultStore(), Custom)
