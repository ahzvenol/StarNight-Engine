import type { Component } from 'solid-js'
import clsx from 'clsx'
import { createEffect, Match, on, onMount, Show, Switch } from 'solid-js'
import { router } from '@/router'
import { onStoreReady } from '@/store'
import { useStore } from '@/store/context'
import { Clone, Variable } from '@/ui/Elements'
import { isDevelopment, isNative } from '@/utils/checkEnv'
import { log } from '@/utils/logger'
import { AudioIds, AudioMutex, Howler } from '../Audio'
import { Button } from '../Button'
import { restartGame } from '../Game/Game'
import { Pages } from '../Pages'
import styles from './Title.module.scss'

const audio = Howler({ loop: true, src: './static/AudioClip/bgm01.flac' })
createEffect(
    on(
        AudioMutex,
        () => {
            if (AudioMutex() !== AudioIds.Title) audio.stop()
        },
        { defer: false }
    )
)

onStoreReady.then(({ config: { bgmvolume } }) => createEffect(() => audio.volume(bgmvolume())))

const Title: Component = () => {
    log.info('Title组件函数被调用')
    const store = useStore()
    const system = store.system
    const local = store.extra
    onMount(() => {
        if (AudioMutex() !== AudioIds.Title) AudioMutex(AudioIds.Title)
        if (!audio.playing()) audio.play()
    })
    return (
        <div class={clsx('Page', styles.Title_container)}>
            <div class={styles.Title_info_container} onClick={() => router.navigate(Pages.Hakuuyosei)}>
                <div>
                    版本:{system.versionname()}&nbsp;&nbsp;{system.releasedate()}
                </div>
                <Show when={isNative()}>
                    <Switch>
                        <Match when={local.latestversion() === -1}>检测更新失败！</Match>
                        <Match when={local.latestversion() > system.versioncode()}>发现新版本！</Match>
                        <Match when={local.latestversion() === system.versioncode()}>当前已是最新版</Match>
                    </Switch>
                </Show>
                <Show when={isDevelopment()}>当前已是最新版</Show>
                <div>白羽夜星制作组</div>
            </div>
            <div class={styles.Title_button_container}>
                <Clone count={4}>
                    {(index) => (
                        <Variable value={['01start', '02load', '03config', '04gallery'][index]}>
                            {(imageId) => (
                                <>
                                    <Button
                                        class={`Title_button_${index}`}
                                        style={{
                                            'background-image': `url('./static/Texture2D/title_${imageId}.webp')`
                                        }}
                                        onClick={async () => {
                                            if (index === 0) await restartGame({ index: 1 })
                                            router.navigate(
                                                [Pages.Game, Pages.Load, Pages.Config, Pages.Gallery][index]
                                            )
                                        }}
                                    />
                                    <style jsx>
                                        {`
                                            @media (hover: hover) {
                                                .Title_button_${index}:hover {
                                                    background-image: url('./static/Texture2D/title_${imageId}_on.webp') !important;
                                                }
                                            }
                                            .mobile .Title_button_${index} {
                                                transform: scale(1.35) translate(0, ${index * 5}px);
                                                transform-origin: top;
                                            }
                                        `}
                                    </style>
                                </>
                            )}
                        </Variable>
                    )}
                </Clone>
            </div>
        </div>
    )
}

export default Title
