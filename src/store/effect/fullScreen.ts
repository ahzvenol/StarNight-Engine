import { storePromise } from '../store'
import { createEffect } from 'solid-js'
import { logger } from '@/utils/Logger'

storePromise.then((store) => {
    // 并没有办法把用户使用F11等按键触发的全屏同步到变量,因为浏览器不会返回相关信息
    createEffect(() => {
        logger.info('全屏模式: ' + store.config.FullScreen())
        if (store.config.FullScreen()) {
            document.documentElement.requestFullscreen()
        } else {
            if (document.fullscreenElement !== null) document.exitFullscreen()
        }
    })
})