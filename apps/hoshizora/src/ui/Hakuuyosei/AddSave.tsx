import type { Component } from 'solid-js'
import type { SaveLocalData } from '@/store/default'
import { useSignal } from 'micro-reactive-solid'
import { Match, Switch } from 'solid-js'
import { StarNight } from '@starnight/core'
import { store } from '@/store'
import styles from './Hakuuyosei.module.scss'

StarNight.ActEvents.next.subscribe(({ current, local, instance }) => {
    if (instance.state.isInitializing()) {
        console.log(Object.keys(local).length === 1, 'index' in local)
        if (Object.keys(local).length === 1 && 'index' in local) {
            if (current.index() === local.index) {
                local.count = current.count() + 1
            }
        }
    }
})

// todo:
export const AddSave: Component = () => {
    const local = store.local
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
                placeholder="存档号"
                onMouseDown={(e) => (e.target as HTMLInputElement).focus()}
                onInput={(e) => saveInput(e.target.value)}
                value={saveInput()}
            />
            <input
                type="text"
                style={{ left: '100px', width: `80px` }}
                class={styles.Hakuuyosei_input}
                placeholder="幕号"
                onMouseDown={(e) => (e.target as HTMLInputElement).focus()}
                onInput={(e) => actInput(e.target.value)}
                value={actInput()}
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
