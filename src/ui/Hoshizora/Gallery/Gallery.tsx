import type { Component } from 'solid-js'
import clsx from 'clsx'
import { intersection } from 'es-toolkit'
import { Show } from 'solid-js'
import { useStore } from '@/store/context'
import { Clone } from '@/ui/Elements'
import { log } from '@/utils/logger'
import { useSignal } from '@/utils/Reactive'
import { CGElement } from './CGElement'
import styles from './Gallery.module.scss'

const CG = [
    ['evcg01', 'a', 'b', 'c', 'c2', 'd', 'e'],
    ['evcg20', 'a', 'b', 'c', 'd'],
    ['evcg02', 'a', 'b', 'c', 'd', 'e'],
    ['evcg03', 'a'],
    ['evcg04', 'a', 'b', 'c', 'd'],
    ['evcg05', 'a', 'b'],
    ['evcg06', 'a', 'b'],
    ['evcg07', 'a', 'b'],
    ['evcg21', 'a', 'b', 'c', 'd', 'e', 'f'],
    ['evcg08', 'a', 'b'],
    ['evcg09', 'a', 'b'],
    ['evcg10', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l'],
    ['evcg11', 'a', 'b', 'c', 'd'],
    ['evcg12', 'a', 'b', 'c'],
    ['evcg13', 'a', 'a2', 'b', 'c'],
    ['evcg19', 'a'],
    ['evcg18', 'b', 'c', 'd'],
    ['evcg14', 'a', 'b'],
    ['evcg15', 'a'],
    ['evcg16', 'a'],
    ['evcg17', 'a']
].map((arr) => arr.slice(1).map((id) => arr[0] + id))

const Gallery: Component = () => {
    log.info('Gallery组件函数被调用')
    const currentPage = useSignal<0 | 1>(0)
    const cg = useStore().save.global.cg
    const viewedCG = (index: number) => intersection(CG[index + currentPage() * 16] || [], cg())
    return (
        <div class={clsx('Page', styles.Gallery_container)}>
            <div id={styles.Gallery_CG_container} />
            <div
                class={clsx(styles.Gallery_switch, styles.Gallery_switch_1, {
                    [styles.Gallery_switch_hover]: currentPage() !== 0
                })}
                onClick={() => currentPage(0)}>
                1
            </div>
            <div
                class={clsx(styles.Gallery_switch, styles.Gallery_switch_2, {
                    [styles.Gallery_switch_hover]: currentPage() !== 1
                })}
                onClick={() => currentPage(1)}>
                2
            </div>
            <div class={styles.Gallery_content}>
                <Clone count={16}>
                    {(index) => (
                        <Show
                            when={!(currentPage() === 1 && index + 1 > 5)}
                            fallback={
                                <div
                                    class={clsx(styles.Gallery_content_element, styles.Gallery_content_element_empty)}
                                />
                            }>
                            <CGElement cg={() => viewedCG(index)} />
                        </Show>
                    )}
                </Clone>
            </div>
        </div>
    )
}

export default Gallery
