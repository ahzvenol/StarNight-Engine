import type { Component } from 'solid-js'
import { useSignal } from 'micro-reactive-solid'
import { Show } from 'solid-js'
import { useSoundEffect } from '../useSoundEffect'
import styles from './GlobalDialog.module.scss'

interface IShowGlobalDialogProps {
    title: string
    leftText: string
    rightText: string
    leftFunc?: Function0<void>
    rightFunc?: Function0<void>
}

const DialogContent = useSignal<IShowGlobalDialogProps | null>(null)

export const useDialog = (props: IShowGlobalDialogProps) => DialogContent(props)

const Dialog: Component = () => (
    <Show when={DialogContent() !== null}>
        <div class={styles.GlobalDialog_main}>
            <div class={styles.GlobalDialog_container}>
                <div class={styles.GlobalDialog_container_inner}>
                    <div class={styles.GlobalDialog_title}>{DialogContent()?.title}</div>
                    <div class={styles.GlobalDialog_button_list}>
                        <div
                            ref={useSoundEffect('Click', 'Enter')}
                            class={styles.GlobalDialog_button}
                            onClick={() => {
                                DialogContent()!.leftFunc?.()
                                DialogContent(null)
                            }}>
                            {DialogContent()?.leftText}
                        </div>
                        <div
                            ref={useSoundEffect('Click', 'Enter')}
                            class={styles.GlobalDialog_button}
                            onClick={() => {
                                DialogContent()!.rightFunc?.()
                                DialogContent(null)
                            }}>
                            {DialogContent()?.rightText}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Show>
)

export default Dialog
