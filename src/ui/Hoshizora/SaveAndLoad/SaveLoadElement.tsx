import type { Signal } from 'micro-reactive'
import type { Component } from 'solid-js'
import type { LocalSaveData } from '@/store/default'
import type { SaveLoadMode } from './SaveLoad'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { Show } from 'solid-js'
import { getSave } from '@/core/save'
import { router } from '@/router'
import { Content } from '@/ui/Elements'
import { restartGame } from '@/ui/Pages'
import { Pages } from '@/ui/Type'
import Scale from './../../Scale'
import styles from './SaveAndLoad.module.scss'

type SaveLoadElementProps = { mode: SaveLoadMode; index: number; save: Signal<LocalSaveData> }

export const SaveLoadElement: Component<SaveLoadElementProps> = ({ mode, index, save }) => (
    <div
        class={clsx(styles.Save_Load_content_element, {
            [styles.Save_Load_content_element_hover]: mode === 'Save' || save() !== undefined
        })}
        onClick={() => {
            if (mode === 'Save') {
                save(getSave())
            } else if (save() !== undefined) {
                restartGame(save()!)
                router.navigate(Pages.Game)
            }
        }}>
        <div class={styles.Save_Load_content_element_index}>
            {/* 原作从0开始 */}
            No.&nbsp;&nbsp;&nbsp;{index}
        </div>
        <Show
            when={save() !== undefined}
            fallback={
                <>
                    <div class={styles.Save_Load_content_element_empty_image} />
                    <div class={styles.Save_Load_content_text}>Empty</div>
                </>
            }>
            <div class={styles.Save_Load_content_element_image}>
                <Scale width={1280} height={720} mode="full">
                    <Content innerHTML={save().snapshot} />
                </Scale>
            </div>
            <div class={styles.Save_Load_content_element_date}>{dayjs(save().date).format('YYYY/MM/DD HH:mm:ss')}</div>
            <div class={styles.Save_Load_content_text}>{save().text}</div>
        </Show>
    </div>
)
