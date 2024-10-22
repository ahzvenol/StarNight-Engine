import { Route, router } from '@/router'
import { BGM, Clip, SE } from '@/store/effect/audioManager'
import { play } from '@/utils/AudioUtil'
import { log } from '@/utils/Logger'
import { useSignal } from '@/utils/Reactive'
import { set } from 'date-fns'
import { Component, createEffect, on, ParentProps } from 'solid-js'
import { KeepAlive, useKeepAlive } from 'solid-keep-alive'

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

const key = useSignal(0)

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
    const { removeElement } = useKeepAlive()[1]
    createEffect(on(key, () => removeElement(Pages.Game)))
    return (
        <Route path={Pages.Game}>
            {/* @ts-expect-error  返回类型 "() => Element" 不是有效的 JSX 元素。*/}
            <KeepAlive id={Pages.Game}>{props.children}</KeepAlive>
        </Route>
    )
}

const restartGame = () => key((i) => i + 1)

export { Pages, Title, Game, restartGame }
