import type { Component, ParentProps } from 'solid-js'
import { createEffect, on } from 'solid-js'
import { KeepAlive, useKeepAlive } from 'solid-keep-alive'
import { Route, router } from '@/router'
import { useAudioConfig } from '@/store/effect/audioManager'
import { log } from '@/utils/Logger'
import { useSignal } from '@/utils/Reactive'

enum Pages {
    'Title' = '',
    'Game' = 'Game',
    'Config' = 'Config',
    'Load' = 'Load',
    'Save' = 'Save',
    'Gallery' = 'Gallery'
}

const Title: Component<ParentProps<{ bgm: string }>> = (props) => {
    const TitleBGM = useAudioConfig(
        'BGM',
        new Howl({
            src: props.bgm
        })
    )
    createEffect(
        on(router.active, () => {
            if (router.active() === Pages.Title) {
                if (!TitleBGM.playing()) {
                    TitleBGM.play()
                    log.info('播放主背景音乐')
                }
            } else if (router.active() === Pages.Game) {
                TitleBGM.stop()
            }
        })
    )
    return <Route path={Pages.Title}>{props.children}</Route>
}

const key = useSignal(0)

const Game: Component<ParentProps> = (props) => {
    const { removeElement } = useKeepAlive()[1]
    createEffect(on(key, () => removeElement(Pages.Game)))
    return (
        <Route path={Pages.Game}>
            {/* @ts-expect-error  返回类型 "() => Element" 不是有效的 JSX 元素。*/}
            <KeepAlive id={Pages.Game}>{props.children}</KeepAlive>
        </Route>
    )
}

export const restartGame = () => key((i) => i + 1)

export { Game, Pages, Title }
