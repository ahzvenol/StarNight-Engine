import type { Component } from 'solid-js'
import { createEffect, createResource, Match, Switch } from 'solid-js'
import { onStoreReady } from './store'
import { GUIRoot } from './views/GUIRoot'
import { isMobile, isTouchDevice } from './utils/checkEnv'
import { log } from './utils/Logger'
import { exitFullscreen, requestFullscreen } from './utils/fullscreen'

// 禁止右键开启上下文菜单
document.oncontextmenu = () => false

// 为触摸设备添加css类,通过:global(.mobile)控制样式
if (isMobile() || isTouchDevice()) document.documentElement.classList.add('mobile')

// 将游戏名称设置为网页标题
onStoreReady.then((store) => (document.title = store.system.name()))

// 如果不是移动端,将全屏设置项绑定到浏览器全屏状态
// 由用户通过F11等方式触发的全屏不会通知js,不能自动更新设置
onStoreReady.then((store) => {
    if (!isMobile()) {
        createEffect(() => {
            log.info('全屏模式: ' + store.config.fullscreen())
            if (store.config.fullscreen()) {
                requestFullscreen()
            } else {
                exitFullscreen()
            }
        })
    }
})

const [store] = createResource(() => onStoreReady)

const App: Component = () => (
    <Switch>
        <Match when={store.error}>
            <div>{store.error}</div>
        </Match>
        <Match when={!store.loading}>
            <GUIRoot />
        </Match>
    </Switch>
)

export default App
