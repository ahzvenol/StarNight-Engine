import type { Component } from 'solid-js'
import type { SaveLocalData } from '@/store/default'
import { useSignal } from 'micro-reactive-solid'
import { Match, Switch } from 'solid-js'
import { useStore } from '@/store/context'
import styles from './Hakuuyosei.module.scss'

export const Add: Component = () => {
    const local = useStore().local
    const actInput = useSignal('')
    const saveInput = useSignal('')
    const actIndex = () => Number(actInput())
    const slotIndex = () => Number(saveInput())
    const isEmpty = () => !actInput() || !saveInput()
    const invalid = () =>
        !/^\d+$/.test(actInput()) || !/^\d+$/.test(saveInput()) || actIndex() > 13824 || slotIndex() > 89
    return (
        <div class={styles.Hakuuyosei_add_container}>
            <input
                type="text"
                style={{ width: `80px` }}
                class={styles.Hakuuyosei_input}
                placeholder="幕号"
                onMouseDown={(e) => (e.target as HTMLInputElement).focus()}
                onInput={(e) => actInput(e.target.value)}
                value={actInput()}
            />
            <input
                type="text"
                style={{ left: '100px', width: `80px` }}
                class={styles.Hakuuyosei_input}
                placeholder="存档号"
                onMouseDown={(e) => (e.target as HTMLInputElement).focus()}
                onInput={(e) => saveInput(e.target.value)}
                value={saveInput()}
            />
            <div style={{ left: '320px', top: '10px' }} class={styles.Hakuuyosei_warn}>
                <Switch>
                    <Match when={isEmpty()}> </Match>
                    <Match when={invalid()}>当前输入无效</Match>
                    <Match when={local[slotIndex()]()}>请注意,将覆盖已有存档</Match>
                </Switch>
            </div>
            <div
                style={{ left: '200px', top: '3px', width: `110px` }}
                class={styles.Hakuuyosei_button}
                onClick={() => {
                    if (!invalid()) {
                        local[Number(saveInput())]({ index: Number(actInput()) } as SaveLocalData)
                    }
                }}
            >
                添加存档
            </div>
        </div>
    )
}
