import type { Component } from 'solid-js'
import clsx from 'clsx'
import { Match, Show, Switch } from 'solid-js'
import { router } from '@/router'
import { useStore } from '@/store/context'
import { Button, Clone, Variable } from '@/ui/Elements'
import { restartGame } from '@/ui/Pages'
import { Pages } from '@/ui/Type'
import { isDevelopment, isNative } from '@/utils/checkEnv'
import { log } from '@/utils/logger'
import styles from './Title.module.scss'

const Title: Component = () => {
    log.info('Title组件函数被调用')
    const store = useStore()
    const system = store.system
    const local = store.local
    return (
        <div class={clsx('Page', styles.Title_container)}>
            <div class={styles.Title_info_container} onClick={() => router.navigate('Hakuuyosei')}>
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
                                        onClick={() => {
                                            if (index === 0) restartGame()
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
