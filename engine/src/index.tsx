/* @refresh reload */
import { render } from 'solid-js/web'
import { DelegatedEvents } from 'solid-js/web'
import App from './App'
import './index.css'

// 禁止Dynamic组件使用事件委托
DelegatedEvents.clear()

render(() => <App />, document.getElementById('root')!)
