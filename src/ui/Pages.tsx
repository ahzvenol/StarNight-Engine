import type { Component, ParentProps } from 'solid-js'
import { createEffect, on } from 'solid-js'
import { initData } from '@/core/Core'
import { Route, router } from '@/router'
import { useAudioConfig } from '@/store/effect/audioManager'
import { KeepAlive } from '@/utils/KeepAlive'
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

const Title: Component<ParentProps> = (props) => {
    const TitleBGM = useAudioConfig(
        'BGM',
        new Howl({
            src: '/static/AudioClip/bgm01.wav'
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
    return (
        <>
            <Route path={Pages.Game}>
                <KeepAlive id={Pages.Game} key={key}>
                    {props.children}
                </KeepAlive>
            </Route>
        </>
    )
}

export const restartGame = (data = { index: 1 }) => {
    initData(data)
    key((i) => i + 1)
}

export { Game, Pages, Title }
