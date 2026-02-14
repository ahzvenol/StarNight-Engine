/* @refresh reload */
import { render, DelegatedEvents } from 'solid-js/web'

import { App } from './App'

// 禁止Dynamic组件使用事件委托
DelegatedEvents.clear()

render(() => <App />, document.getElementById('root')!)
