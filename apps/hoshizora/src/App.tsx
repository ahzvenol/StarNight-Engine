import type { Component } from 'solid-js'
import { createEffect, createResource, Match, Switch } from 'solid-js'
import { onStoreReady } from './store'
import { GUIRoot } from './ui/GUIRoot'
import { isMobile, isTouchDevice } from './utils/checkEnv'
import { log } from './utils/Logger'

// 禁止右键,禁止拖动
document.oncontextmenu = document.onmousedown = () => false

// 为触摸设备添加css类,通过:global(.mobile)控制样式
if (isMobile() || isTouchDevice()) document.documentElement.classList.add('mobile')

// 将游戏名称设置为网页标题
onStoreReady.then((store) => (document.title = store.system.name()))

// 如果不是移动端,将全屏设置项绑定到浏览器全屏状态
// 由用户通过F11等方式触发的全屏无法被js感知,并不能自动更新设置
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

const [store] = createResource(() => onStoreReady)

// 整个配置文件在这里分发
const App: Component = () => (
    <Switch>
        <Match when={store.state === 'pending' || store.state === 'unresolved'}>
            <></>
        </Match>
        <Match when={store.state === 'ready'}>
            <GUIRoot />
        </Match>
        <Match when={store.state === 'errored'}>
            <div>{store.error}</div>
        </Match>
    </Switch>
)

export default App
