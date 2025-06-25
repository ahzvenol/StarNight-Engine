import type { Reactive } from 'micro-reactive-solid'
import type { Component } from 'solid-js'
import type { SaveLocalData } from '@/store/default'
import type { SaveLoadMode } from './SaveLoad'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { Show } from 'solid-js'
import { starnight } from '@/store/starnight'
import { useGame } from '../GameRoot'
import { useDialog } from '../GlobalDialog/GlobalDialog'
import { translation } from '../translations'
import { useSoundEffect } from '../useSoundEffect'
import styles from './SaveAndLoad.module.scss'

type SaveLoadElementProps = { i: number, mode: SaveLoadMode, index: number, slot: Reactive<SaveLocalData> }

function snapshot() {
    const app = starnight().context.temp.pixi
    const stage = app.renderer.extract.canvas(app.stage, app.screen) as HTMLCanvasElement
    const canvas = (<canvas width={480} height={270} />) as HTMLCanvasElement
    canvas.getContext('2d')!.drawImage(stage, 0, 0, app.screen.width, app.screen.height, 0, 0, 480, 270)
    return canvas.toDataURL('image/webp', 0.5)
}

function record(slot: Reactive<SaveLocalData>) {
    slot({
        ...starnight().current(),
        date: dayjs().valueOf(),
        snapshot: snapshot()
    })
}

export const SaveLoadElement: Component<SaveLoadElementProps> = ({ i, mode, index, slot }) => {
    const clickEffect = mode === 'Load' ? 'Click' : slot() !== undefined ? 'DialogOpen' : 'PageChange'
    const onSave = () => {
        if (mode === 'Save') {
            if (slot() === undefined) record(slot)
            else
                useDialog({
                    title: translation.menu.saving.isOverwrite(),
                    leftText: translation.common.yes(),
                    rightText: translation.common.no(),
                    leftFunc: () => record(slot)
                })
        }
    }
    const onLoad = () => {
        if (slot() !== undefined) useGame(slot()!)
    }
    return (
        <div
            ref={useSoundEffect('Enter', clickEffect)}
            class={styles.Save_Load_content_element}
            style={{ 'animation-delay': `${(i + 1) * 30}ms` }}
            onClick={mode === 'Save' ? onSave : onLoad}
        >
            <Show when={slot()}>
                <div class={styles.Save_Load_content_element_top}>
                    <div
                        class={clsx(styles.Save_Load_content_element_top_index, {
                            [styles.Load_content_element_top_index]: mode === 'Load'
                        })}
                    >
                        {index}
                    </div>
                    <div
                        class={clsx(styles.Save_Load_content_element_top_date, {
                            [styles.Load_content_element_top_date]: mode === 'Load'
                        })}
                    >
                        {dayjs(slot.date()).format('MM-DD HH:mm:ss')}
                    </div>
                </div>
                <img class={styles.Save_Load_content_image} src={slot.snapshot()} />
                <div class={styles.Save_Load_content_text}>
                    <div
                        class={clsx(styles.Save_Load_content_name, {
                            [styles.Load_content_name]: mode === 'Load'
                        })}
                        innerText={slot.name()}
                    />
                    <div class={styles.Save_Load_content_text_padding} innerHTML={slot.text()} />
                </div>
            </Show>
        </div>
    )
}
