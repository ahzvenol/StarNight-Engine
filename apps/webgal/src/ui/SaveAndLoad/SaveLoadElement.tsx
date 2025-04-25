import type { Reactive } from 'micro-reactive-solid'
import type { Component } from 'solid-js'
import type { SaveLocalData } from '@/store/default'
import type { SaveLoadMode } from './SaveLoad'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { Show } from 'solid-js'
import { starnight } from '@/store/starnight'
import { Content } from '@/core/ui/Elements'
import Scale from '@/core/ui/Scale'
import { GameRef } from '@/ui/Game/Game'
import { useDialog } from '../GlobalDialog/GlobalDialog'
import { useGame } from '../Root/GameRoot'
import { translation } from '../translations'
import { useSoundEffect } from '../useSoundEffect'
import styles from './SaveAndLoad.module.scss'

type SaveLoadElementProps = { i: number; mode: SaveLoadMode; index: number; slot: Reactive<SaveLocalData> }

export const SaveLoadElement: Component<SaveLoadElementProps> = ({ i, mode, index, slot }) => {
    const clickEffect = mode === 'Load' ? 'Click' : slot() !== undefined ? 'DialogOpen' : 'PageChange'

    const save = () => slot({ ...starnight().current(), date: dayjs().valueOf(), snapshot: GameRef()!.outerHTML })
    const onClick = async () => {
        if (mode === 'Save') {
            if (slot() !== undefined) {
                useDialog({
                    title: translation.menu.saving.isOverwrite(),
                    leftText: translation.common.yes(),
                    rightText: translation.common.no(),
                    leftFunc: save
                })
            } else {
                save()
            }
        } else if (slot() !== undefined) {
            await useGame(slot()!)
        }
    }
    return (
        <div
            ref={useSoundEffect('Enter', clickEffect)}
            class={styles.Save_Load_content_element}
            style={{ 'animation-delay': `${(i + 1) * 30}ms` }}
            onClick={onClick}>
            <Show when={slot()}>
                <div class={styles.Save_Load_content_element_top}>
                    <div
                        class={clsx(styles.Save_Load_content_element_top_index, {
                            [styles.Load_content_element_top_index]: mode === 'Load'
                        })}>
                        {index}
                    </div>
                    <div
                        class={clsx(styles.Save_Load_content_element_top_date, {
                            [styles.Load_content_element_top_date]: mode === 'Load'
                        })}>
                        {dayjs(slot.date()).format('MM-DD HH:mm:ss')}
                    </div>
                </div>
                <div class={styles.Save_Load_content_image}>
                    <Scale width={2560} height={1440} mode="full">
                        <Content innerHTML={slot.snapshot()} />
                    </Scale>
                </div>
                <div class={styles.Save_Load_content_text}>
                    <div
                        class={clsx(styles.Save_Load_content_name, {
                            [styles.Load_content_name]: mode === 'Load'
                        })}>
                        {slot.namepreview()}
                    </div>
                    <div class={styles.Save_Load_content_text_padding}>{slot.textpreview()}</div>
                </div>
            </Show>
        </div>
    )
}
