import { createEffect } from 'solid-js'
import { isMobile } from '@/utils/checkEnv'
import { log } from '@/utils/logger'
import { onStoreReady } from '..'

onStoreReady.then((store) => {
    if (!isMobile()) {
        // 并没有办法把用户使用F11等按键触发的全屏同步到变量,因为浏览器不会返回相关信息
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
