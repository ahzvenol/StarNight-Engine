import { createEffect } from 'solid-js'
import { log } from '@/utils/Logger'
import { storePromise } from '../store'

storePromise.then((store) => {
    // 并没有办法把用户使用F11等按键触发的全屏同步到变量,因为浏览器不会返回相关信息
    createEffect(() => {
        log.info('全屏模式: ' + store.config.FullScreen())
        if (store.config.FullScreen()) {
            document.documentElement.requestFullscreen()
        } else {
            if (document.fullscreenElement !== null) document.exitFullscreen()
        }
    })
})
