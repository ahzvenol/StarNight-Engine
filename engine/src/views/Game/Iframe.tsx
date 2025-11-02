import type { Component } from 'solid-js'
import { useEventListener } from '@/utils/solid/useEventListener'
import { ui } from '@/store/starnight'
import styles from './Iframe.module.scss'

export const Iframe: Component = () => {
    return (
        <div class={styles.Game_Iframe}>
            <iframe
                class={styles.Game_Iframe}
                ref={(ref) => {
                    ref.onload = () => ref.contentWindow!.focus()
                    useEventListener('message', (_event) => {
                        const event = _event as MessageEvent
                        if (event.source && event.source === ref.contentWindow) {
                            ui().input.iframe()!.resolve(event.data)
                        }
                    })
                }}
                src={ui().input.iframe()!.src}
            />
        </div>
    )
}
