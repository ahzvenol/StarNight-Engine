import type { Reactive } from 'micro-reactive-solid'
import type { Component } from 'solid-js'
import type { SaveLocalData } from '@/store/default'
import type { SaveLoadMode } from './SaveLoad'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { Show } from 'solid-js'
import { router } from '@/router'
import { starnight } from '@/store/starnight'
import { Content } from '@/utils/ui/Elements'
import { gameRef, restartGame } from '../Game/Game'
import { Pages } from '../Pages'
import Scale from '../../utils/ui/Scale'
import styles from './SaveAndLoad.module.scss'

type SaveLoadElementProps = { mode: SaveLoadMode; index: number; slot: Reactive<SaveLocalData> }

export const SaveLoadElement: Component<SaveLoadElementProps> = ({ mode, index, slot }) => {
    const isAutoSaveSolt = index === 0
    return (
        <div
            class={clsx(styles.Save_Load_content_element, {
                [styles.Save_Load_content_element_hover]: (mode === 'Save' && !isAutoSaveSolt) || slot() !== undefined
            })}
            onClick={async () => {
                if (mode === 'Save') {
                    if (!isAutoSaveSolt) {
                        slot({ ...starnight().current(), date: dayjs().valueOf(), snapshot: gameRef()!.outerHTML })
                    }
                } else if (slot() !== undefined) {
                    await restartGame(slot()!)
                    router.navigate(Pages.Game)
                }
            }}>
            <div class={styles.Save_Load_content_element_index}>
                {isAutoSaveSolt ? 'Auto' : `No.${'\u00A0'}${'\u00A0'}${'\u00A0'}${index}`}
            </div>
            <Show
                when={slot() !== undefined}
                fallback={
                    <>
                        <div class={styles.Save_Load_content_element_empty_image} />
                        <div class={styles.Save_Load_content_text}>Empty</div>
                    </>
                }>
                <div class={styles.Save_Load_content_element_image}>
                    <Scale width={1280} height={720} mode="full">
                        <Content innerHTML={slot.snapshot()} />
                    </Scale>
                </div>
                <div class={styles.Save_Load_content_element_date}>
                    {dayjs(slot.date()).format('YYYY/MM/DD HH:mm:ss')}
                </div>
                <div class={styles.Save_Load_content_text}>{slot.textpreview()}</div>
            </Show>
        </div>
    )
}
