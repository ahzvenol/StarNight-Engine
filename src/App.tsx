import createjs from 'createjs-npm'
import type { Component } from 'solid-js'
import { Match, Switch } from 'solid-js'

import './utils/implicit'
import UI from './ui'
import store from './store'
import '@/store/audioManager'
import { logger } from './utils/Logger'

if (import.meta.env.DEV) { }

// 禁止右键,禁止拖动
document.oncontextmenu = document.onmousedown = () => false

createjs.Ticker.framerate = 60
createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then((registration) => {
            logger.info('ServiceWorker registration successful with scope: ' + registration.scope)
        })
        .catch((error) => {
            logger.error('ServiceWorker registration failed: ' + error)
        })
}

// 整个配置文件在这里分发
const App: Component = () =>
    <Switch>
        <Match when={store.state === 'pending' || store.state === 'unresolved'}>
            <></>
        </Match>
        <Match when={store.state === 'ready'}>
            <UI environment={store()!} />
        </Match>
        <Match when={store.state === 'errored'}>
            <div>{store.error}</div>
        </Match>
    </Switch>

export default App
