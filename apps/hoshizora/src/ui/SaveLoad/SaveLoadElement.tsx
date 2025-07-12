import type { Reactive } from 'micro-reactive-solid'
import type { Component } from 'solid-js'
import type { SaveLocalData } from '@/store/default'
import type { SaveLoadMode } from './SaveLoad'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { Show } from 'solid-js'
import { starnight } from '@/store/starnight'
import { Content } from '@/utils/ui/Elements'
import { Scale } from '@/utils/ui/Scale'
import { useGame } from '../GameRoot'
import styles from './SaveLoad.module.scss'

type SaveLoadElementProps = { mode: SaveLoadMode, index: number, slot: Reactive<SaveLocalData> }

function snapshot() {
    const app = starnight().context.temp.pixi
    const stage = app.renderer.extract.canvas(app.stage, app.screen) as HTMLCanvasElement
    const canvas = (<canvas width={480} height={270} />) as HTMLCanvasElement
    canvas.getContext('2d')!.drawImage(stage, 0, 0, app.screen.width, app.screen.height, 0, 0, 480, 270)
    return canvas.toDataURL('image/webp', 0.5)
}

// todo:完整预览图
function record(slot: Reactive<SaveLocalData>) {
    slot({
        ...starnight().current(),
        date: dayjs().valueOf(),
        snapshot: snapshot()
    })
}

export const SaveLoadElement: Component<SaveLoadElementProps> = ({ mode, index, slot }) => {
    const isAutoSaveSolt = index === 0
    return (
        <div
            class={clsx(styles.Save_Load_content_element, {
                [styles.Save_Load_content_element_hover]: (mode === 'Save' && !isAutoSaveSolt) || slot() !== undefined
            })}
            onClick={() => {
                if (mode === 'Save') record(slot)
                else if (slot() !== undefined) useGame(slot()!)
            }}
        >
            <div class={styles.Save_Load_content_element_index}>
                {isAutoSaveSolt ? 'Auto' : `No.${'\u00A0'}${'\u00A0'}${'\u00A0'}${index}`}
            </div>
            <Show
                when={slot() !== undefined}
                fallback={(
                    <>
                        <div class={styles.Save_Load_content_element_empty_image} />
                        <div class={styles.Save_Load_content_text}>Empty</div>
                    </>
                )}
            >
                <div class={styles.Save_Load_content_element_image}>
                    <Scale width={1280} height={720} mode="full">
                        <Content innerHTML={slot.snapshot()} />
                    </Scale>
                </div>
                <div class={styles.Save_Load_content_element_date}>
                    {dayjs(slot.date()).format('YYYY/MM/DD HH:mm:ss')}
                </div>
                <div class={styles.Save_Load_content_text}>{slot.text()}</div>
            </Show>
        </div>
    )
}
