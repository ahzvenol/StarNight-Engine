import { $async, $await } from '@/core/scripts'
import { $执行, $等待 } from '@/core/scripts/alias'
import { onStoreReady } from '@/store'
import { mapKeys } from 'es-toolkit'

window.$await = $await

window.$async = $async

window.$执行 = $执行

window.$等待 = $等待

window.$call = () => {}

onStoreReady.then((store) => window.$store = store())

window.allScenarioModules = mapKeys(
    import.meta.glob('scenario/**/*.scenario.{js,ts,jsx,tsx}', { eager: true }),
    (_, key) => key.replace('/scenario/', './')
)
console.log(window.allScenarioModules)
