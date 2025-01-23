import { createEffect } from 'solid-js'
import { log } from '@/utils/logger'
import { storePromise } from '../store'

export const effect = () =>
    storePromise.then((store) => {
        // 并没有办法把用户使用F11等按键触发的全屏同步到变量,因为浏览器不会返回相关信息
        createEffect(() => {
            log.info('全屏模式: ' + store.config.fullscreen())
            if (store.config.fullscreen()) {
                document.documentElement.requestFullscreen()
            } else {
                if (document.fullscreenElement !== null) document.exitFullscreen()
            }
        })
    })
