import type { Component, ParentProps } from 'solid-js'
import type { InitialGameData } from '@/core/types/Game'
import { cloneDeep } from 'es-toolkit'
import { Howl } from 'howler'
import { createContext, createEffect, on } from 'solid-js'
import { Core } from '@/core/Core'
import { GameActivateEvent, GameDeactivateEvent, ReturnToTitleEvent } from '@/core/event'
import { Route, router } from '@/router'
import { useAudio } from '@/store/hooks/useAudio'
import { log } from '@/utils/logger'
import { useSignal } from '@/utils/Reactive'
import { KeepAlive } from '@/utils/solid/KeepAlive'
import { Pages } from './Type'

let isInGame = false

createEffect(
    on(
        router.active,
        (now, prev) => {
            if (isInGame) {
                if (now === Pages.Title) {
                    ReturnToTitleEvent.publish()
                } else if (now === Pages.Game) {
                    GameActivateEvent.publish()
                } else if (prev === Pages.Game) {
                    GameDeactivateEvent.publish()
                }
            }
            if (now === Pages.Game) {
                isInGame = true
            } else if (now === Pages.Title) {
                isInGame = false
            }
        },
        { defer: true }
    )
)

export const Title: Component<ParentProps> = (props) => {
    const TitleBGM = useAudio(
        'BGM',
        new Howl({
            src: './static/AudioClip/bgm01.flac'
        })
    )
    createEffect(
        on(router.active, () => {
            if (router.active() === Pages.Title) {
                if (!TitleBGM.playing()) {
                    log.info('播放主背景音乐(开发环境下不播放)')
                    if (!import.meta.env.DEV) {
                        TitleBGM.play()
                    }
                }
            } else if (router.active() === Pages.Game) {
                TitleBGM.stop()
            }
        })
    )
    return <Route path={Pages.Title}>{props.children}</Route>
}

//

export const GameInitialContext = createContext<InitialGameData>()

export const defaultInitialGameData = { index: 1 } as InitialGameData

const initialGameData = useSignal<InitialGameData>(cloneDeep(defaultInitialGameData), { equals: false })

export const Game: Component<ParentProps> = (props) => {
    return (
        <>
            <Route path={Pages.Game}>
                <KeepAlive id={Pages.Game} key={initialGameData}>
                    <GameInitialContext.Provider value={initialGameData()}>
                        <Core>{props.children}</Core>
                    </GameInitialContext.Provider>
                </KeepAlive>
            </Route>
        </>
    )
}

export const restartGame = (data = defaultInitialGameData) => initialGameData(cloneDeep(data))
