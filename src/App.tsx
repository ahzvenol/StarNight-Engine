import createjs from 'createjs-npm'
import type { Component } from 'solid-js'
import { Match, Switch } from 'solid-js'

import '@/store/effect/index'
import UI from './ui/Hoshizora'
import store from './store/store'
import { log } from './utils/Logger'
import { Context } from './store/context'
import { Graphic } from './ui/Elements'
import { KeepAliveProvider } from 'solid-keep-alive'

// 禁止右键,禁止拖动
document.oncontextmenu = document.onmousedown = () => false

createjs.Ticker.framerate = 60
createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED

if (import.meta.env.DEV !== true) {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('/service-worker.js')
            .then((registration) => {
                log.info('ServiceWorker registration successful with scope: ' + registration.scope)
            })
            .catch((error) => {
                log.error('ServiceWorker registration failed: ' + error)
            })
    }
}

// 整个配置文件在这里分发
const App: Component = () => (
    <Switch>
        <Match when={store.state === 'pending' || store.state === 'unresolved'}>
            <></>
        </Match>
        <Match when={store.state === 'ready'}>
            <Context environment={store()!}>
                <KeepAliveProvider maxElements={1}>
                    <Graphic config={store()!.system}>
                        <UI />
                    </Graphic>
                </KeepAliveProvider>
            </Context>
        </Match>
        <Match when={store.state === 'errored'}>
            <div>{store.error}</div>
        </Match>
    </Switch>
)

export default App
