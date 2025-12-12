import type { Component } from 'solid-js'
import type { GameUIInputIframe } from '@/scripts/api/input'
import { useEventListener } from '@/utils/solid/useEventListener'
import styles from './Iframe.module.scss'

export const Iframe: Component<{ iframe: GameUIInputIframe }> = (props) => {
    return (
        <div class={styles.Game_Iframe}>
            <iframe
                class={styles.Game_Iframe}
                src={props.iframe.url}
                ref={(ref) => {
                    ref.onload = () => ref.contentWindow!.focus()
                    useEventListener('message', (_event) => {
                        const event = _event as MessageEvent
                        if (event.source === ref!.contentWindow) {
                            props.iframe.resolve(event.data)
                        }
                    })
                }}
            />
        </div>
    )
}
