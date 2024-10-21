import { Route, router } from '@/router'
import { BGM, Clip, SE } from '@/store/effect/audioManager'
import { play } from '@/utils/AudioUtils'
import { log } from '@/utils/Logger'
import { Component, createEffect, on, ParentProps } from 'solid-js'

enum Pages {
    'Title' = '',
    'Game' = 'Game',
    'Config' = 'Config',
    'Load' = 'Load',
    'Save' = 'Save',
    'Gallery' = 'Gallery'
}

const Title: Component<ParentProps<{ bgm: string }>> = (props) => {
    createEffect(
        on(router.active, () => {
            if (router.active() === Pages.Title) {
                // tag:如果允许自定义轨道的话,这里也要对应的清理轨道
                play(BGM)(props.bgm)
                SE.src = ''
                Clip.src = ''
                log.info('播放主背景音乐')
            }
        })
    )
    return <Route path={Pages.Title}>{props.children}</Route>
}

const Game: Component<ParentProps> = (props) => {
    createEffect(
        on(router.active, () => {
            if (router.active() === Pages.Game) {
                BGM.src = ''
                SE.src = ''
                Clip.src = ''
            }
        })
    )
    return <Route path={Pages.Game}>{props.children}</Route>
}

export { Pages, Title, Game }
