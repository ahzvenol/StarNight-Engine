import type { Component, JSX } from 'solid-js'
import { UISE } from '@/store/audio'
import { useEventListener } from '@/utils/solid/useEventListener'

const ClickSE = UISE({ src: './static/mouse_click_1.mp3' })
const HoverSE = UISE({ src: './static/mouse_hover_1.mp3' })

export const Button: Component<Omit<JSX.HTMLAttributes<HTMLDivElement>, 'ref'>> = (props) => {
    return (
        <div
            ref={(ref) => {
                useEventListener('click', () => ClickSE.play(), { target: ref })
                useEventListener('mouseenter', () => HoverSE.play(), { target: ref })
            }}
            {...props}
        />
    )
}
