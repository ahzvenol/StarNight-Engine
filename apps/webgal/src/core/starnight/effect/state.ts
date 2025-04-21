import { createEffect, on, onCleanup } from 'solid-js'
import { StarNight } from 'starnight'
import { router } from '@/router'
import { Pages } from '@/ui/Webgal/Pages'
import { useEventListener } from '@/utils/solid/useEventListener'
import { starnight } from '..'

// 在进入游戏外页面时调用以暂停自动和快进,在离开此页面时恢复
export const handleAutoAndFast = () => {
    if (starnight().state.isAuto()) {
        starnight().ClickEvents.auto.publish()
        onCleanup(() => {
            starnight().ClickEvents.auto.publish()
        })
    } else if (starnight().state.isFast()) {
        starnight().ClickEvents.fast.publish()
        onCleanup(() => {
            starnight().ClickEvents.auto.publish()
        })
    }
}

createEffect(
    on(
        router.active,
        (now, prev) => {
            // 返回标题页时暂停游戏,回到标题页时恢复
            if (now === Pages.Title) {
                starnight()?.suspend()
            } else if (now === Pages.Game) {
                starnight()?.resume()
                // 在游戏页面离开标签页时暂停游戏,回到标签页时恢复
                useEventListener('visibilitychange', function () {
                    if (document.visibilityState === 'hidden') {
                        starnight()?.suspend()
                    } else if (document.visibilityState === 'visible') {
                        starnight()?.resume()
                    }
                })
            } else if (prev === Pages.Game) {
                handleAutoAndFast()
            }
        },
        { defer: true }
    )
)

// 结束游戏回到标题页
StarNight.GameEvents.end.subscribe(() => {
    router.navigate(Pages.Title)
})
