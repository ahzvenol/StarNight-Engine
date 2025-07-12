import type { Component } from 'solid-js'
import clsx from 'clsx'
import { range } from 'es-toolkit'
import { useSignal } from 'micro-reactive-solid'
import { For, Show } from 'solid-js'
import { Clone, Variable } from '@/utils/ui/Elements'
import { CG } from '@/store/gallery'
import { useSoundEffect } from '../useSoundEffect'
import { CGElement } from './CGElement'
import styles from './GalleryCG.module.scss'

export const GalleryCG: Component = () => {
    const currentPage = useSignal(1)

    const pageElementCount = 8
    return (
        <div class={styles.Gallery_CG_container}>
            <div class={styles.Gallery_CG_top}>
                <div class={styles.Gallery_CG_top_button_list}>
                    <Clone count={Math.ceil(CG.length / 8)}>
                        {(i) => (
                            <Variable value={i + 1}>
                                {(i) => (
                                    <div
                                        ref={useSoundEffect('Click', 'Enter')}
                                        class={clsx(styles.Gallery_CG_top_button, {
                                            [styles.Gallery_CG_top_button_active]: currentPage() === i
                                        })}
                                        onClick={() => currentPage(i)}
                                        innerText={i}
                                    />
                                )}
                            </Variable>
                        )}
                    </Clone>
                </div>
            </div>
            <div class={styles.Gallery_CG_content}>
                <For each={range(0, pageElementCount)}>
                    {(i) => (
                        <Variable value={() => CG[(currentPage() - 1) * pageElementCount + i]}>
                            {(cgs) => (
                                <Show keyed when={cgs()}>
                                    <CGElement i={i} cgs={cgs()} />
                                </Show>
                            )}
                        </Variable>
                    )}
                </For>
            </div>
        </div>
    )
}
