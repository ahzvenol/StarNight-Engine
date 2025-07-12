import type { Component, JSX } from 'solid-js'
import { useEventListener } from '@/utils/solid/useEventListener'
import { UISE } from './Audio'

const ClickSE = UISE({ src: './static/mouse_click_1.wav' })
const HoverSE = UISE({ src: './static/mouse_hover_1.wav' })

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
