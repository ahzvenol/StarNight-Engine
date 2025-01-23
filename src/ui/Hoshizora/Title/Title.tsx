import type { Component } from 'solid-js'
import clsx from 'clsx'
import { Match, Switch } from 'solid-js'
import { router } from '@/router'
import { useStore } from '@/store/context'
import { Button, Clone, Variable } from '@/ui/Elements'
import { restartGame } from '@/ui/Pages'
import { Pages } from '@/ui/Type'
import { isMobile } from '@/utils/checkEnv'
import { log } from '@/utils/logger'
import styles from './Title.module.scss'

const Title: Component = () => {
    log.info('Title组件函数被调用')
    const store = useStore()
    const system = store.system
    const user = store.user
    return (
        <div class={clsx('Page', styles.Title_container)}>
            <div style={{ 'font-size': isMobile() ? '30px' : '20px' }} class={styles.Title_update_status}>
                <Switch>
                    <Match when={user.latestversion() > system.versioncode()}>发现新版本！</Match>
                    <Match when={user.latestversion() === -1}>检测更新失败！</Match>
                    <Match when={user.latestversion() === system.versioncode()}>当前已是最新版</Match>
                </Switch>
            </div>
            <div style={{ 'font-size': isMobile() ? '30px' : '20px' }} class={styles.Title_info_container}>
                <div>
                    版本:{system.versioncode()}&nbsp;&nbsp;{system.versionname()}
                </div>
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
                                            @media (hover: none) {
                                                .Title_button_${index} {
                                                    transform: scale(1.35) translate(0, ${index * 5}px);
                                                    transform-origin: top;
                                                }
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
