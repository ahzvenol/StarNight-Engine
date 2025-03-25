import { SystemDefaultStore } from './default'

const _store = Promise.resolve(SystemDefaultStore()).catch(() => SystemDefaultStore())

export const CustomDefaultStore = () => _store
