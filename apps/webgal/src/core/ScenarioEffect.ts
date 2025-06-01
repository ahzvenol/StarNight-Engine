import { $async, $await } from '@/core/scripts'
import { $执行, $等待 } from '@/core/scripts/alias'
import { onStoreReady } from '@/store'
import { $action } from './ScenarioBook'

// 挂载命令到window,简化添加import的编译器流程
window.$await = $await

window.$async = $async

window.$执行 = $执行

window.$等待 = $等待

// 挂载store到window,简化添加import的编译器流程
onStoreReady.then((store) => window.$store = store())

// 挂载空函数到window,避免is not a function异常
window.$call = () => {}

window.$action = $action
