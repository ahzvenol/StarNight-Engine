import type { Component } from 'solid-js'
import { createResource, Show } from 'solid-js'
import { onStoreReady } from './store'
import { GUIRoot } from './views/GUIRoot'
import './App.css'

// 阻止默认右键菜单，忽略触摸发出的右键事件
window.addEventListener('contextmenu', (e) => {
    e.preventDefault()
    if ((e as PointerEvent).pointerType !== 'mouse') {
        e.stopImmediatePropagation()
    }
}, true)

// 全局禁用图片拖拽，视频画中画，阻止 iOS 自动全屏视频
const defaultImgAttr = { draggable: false }
const defaultVideoAttr = { playsInline: true, disablePictureInPicture: true }
const observer = new MutationObserver((mutations) => {
    for (let i = 0; i < mutations.length; i++) {
        const addedNodes = mutations[i].addedNodes
        for (let j = 0; j < addedNodes.length; j++) {
            const el = addedNodes[j] as HTMLElement
            if (el.nodeType !== 1) continue
            const imgs = el.tagName === 'IMG' ? [el] : el.getElementsByTagName('img')
            for (let i = 0; i < imgs.length; i++) Object.assign(imgs[i], defaultImgAttr)
            const videos = el.tagName === 'VIDEO' ? [el] : el.getElementsByTagName('video')
            for (let i = 0; i < videos.length; i++) Object.assign(videos[i], defaultVideoAttr)
        }
    }
})
observer.observe(document.getElementById('root')!, { childList: true, subtree: true })

const [resource] = createResource(() => onStoreReady)
export const App: Component = () => (<Show when={!resource.loading}> <GUIRoot /> </Show>)
