import type { Component } from 'solid-js'
import clsx from 'clsx'
import { intersection } from 'es-toolkit'
import { Match, Show, Switch } from 'solid-js'
import { useStore } from '@/store/context'
import { Clone } from '@/ui/Elements'
import { log } from '@/utils/logger'
import { useSignal } from 'micro-reactive-solid'
import { MusicIcon } from '../Common/Icon'
import { CGElement } from './CGElement'
import { CG } from './data'
import styles from './Gallery.module.scss'
import { Music } from './Music'
import { VCGElement } from './VCGElement'

export const CGMountPoint = 'Gallery_CG_mount_point'

const currentPage = useSignal<0 | 1 | 2>(0)
const Gallery: Component = () => {
    log.info('Gallery组件函数被调用')
    const cg = useStore().save.global.unlock
    const viewedCG = (index: number) => intersection(CG[index + currentPage() * 16] || [], cg())
    return (
        <div class={clsx('Page', styles.Gallery_container)}>
            <div id={CGMountPoint} class={styles.Gallery_CG_container} />
            <div
                class={clsx(styles.Gallery_switch, styles.Gallery_switch_0, {
                    [styles.Gallery_switch_hover]: currentPage() !== 0
                })}
                onClick={() => currentPage(0)}>
                1
            </div>
            <div
                class={clsx(styles.Gallery_switch, styles.Gallery_switch_1, {
                    [styles.Gallery_switch_hover]: currentPage() !== 1
                })}
                onClick={() => currentPage(1)}>
                2
            </div>
            <div
                class={clsx(styles.Gallery_switch, styles.Gallery_switch_2, {
                    [styles.Gallery_switch_hover]: currentPage() !== 2
                })}
                onClick={() => currentPage(2)}>
                <MusicIcon />
            </div>
            <Show when={currentPage() === 0 || currentPage() === 1}>
                <div class={styles.Gallery_content_cg}>
                    <Clone count={16}>
                        {(index) => (
                            <>
                                <Switch>
                                    <Match when={!(currentPage() === 1 && index + 1 > 5)}>
                                        <CGElement cg={() => viewedCG(index)} />
                                    </Match>
                                    <Match when={currentPage() === 1 && index + 1 > 7}>
                                        <div
                                            class={clsx(
                                                styles.Gallery_content_cg_element,
                                                styles.Gallery_content_cg_element_empty
                                            )}
                                        />
                                    </Match>
                                    <Match when={currentPage() === 1 && index === 5}>
                                        <VCGElement
                                            cg={() => (cg().includes('music1') ? ['op', './static/OP.mp4'] : [])}
                                        />
                                    </Match>
                                    <Match when={currentPage() === 1 && index === 6}>
                                        <VCGElement
                                            cg={() => (cg().includes('music2') ? ['ed', './static/ED.mp4'] : [])}
                                        />
                                    </Match>
                                </Switch>
                            </>
                        )}
                    </Clone>
                </div>
            </Show>
            <Show when={currentPage() === 2}>
                <Music />
            </Show>
        </div>
    )
}

export default Gallery
