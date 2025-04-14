import type { Component } from 'solid-js'
import { createEffect, createResource, Match, Switch } from 'solid-js'
import { KeepAliveProvider } from 'solid-keep-alive'
import { onStoreReady } from './store'
import { Context } from './store/context'
import UI from './ui/Hoshizora'
import { isMobile, isMobileLike } from './utils/checkEnv'
import { log } from './utils/logger'

// 禁止右键,禁止拖动
document.oncontextmenu = document.onmousedown = () => false

if (isMobile() || isMobileLike()) document.documentElement.classList.add('mobile')

const [store] = createResource(() => onStoreReady)

onStoreReady.then((store) => (document.title = store.system.name()))

// 并没有办法把用户使用F11等按键触发的全屏同步到变量,因为浏览器不会返回相关信息
onStoreReady.then((store) => {
    if (!isMobile()) {
        createEffect(() => {
            log.info('全屏模式: ' + store.config.fullscreen())
            if (store.config.fullscreen()) {
                document.documentElement.requestFullscreen()
            } else {
                if (document.fullscreenElement !== null) document.exitFullscreen()
            }
        })
    }
})

// 整个配置文件在这里分发
const App: Component = () => (
    <Switch>
        <Match when={store.state === 'pending' || store.state === 'unresolved'}>
            <></>
        </Match>
        <Match when={store.state === 'ready'}>
            <Context environment={store()!}>
                <KeepAliveProvider>
                    <UI />
                </KeepAliveProvider>
            </Context>
        </Match>
        <Match when={store.state === 'errored'}>
            <div>{store.error}</div>
        </Match>
    </Switch>
)

export default App
