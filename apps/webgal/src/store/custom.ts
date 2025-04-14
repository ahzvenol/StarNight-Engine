import { cloneDeep } from 'es-toolkit'
import { SystemDefaultStore } from './default'

const store = Promise.resolve(SystemDefaultStore()).catch(() => SystemDefaultStore())

export const CustomDefaultStore = () => store.then((store) => cloneDeep(store))
