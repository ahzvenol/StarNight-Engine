import type { Component, JSX } from 'solid-js'
import { once } from 'es-toolkit'
import { UISE } from '@/store/audio'

const ClickSE = UISE({ src: './static/mouse_click_1.wav' })
const HoverSE = UISE({ src: './static/mouse_hover_1.wav' })

export const Button: Component<Omit<JSX.HTMLAttributes<HTMLDivElement>, 'ref'>> = (props) => {
    return (
        <div
            ref={(ref) => {
                ref.addEventListener('click', () => ClickSE.play())
                // 当元素被添加到页面上时，如果光标已经处于其上方，不要触发进入音效。
                ref.addEventListener('mouseenter', () =>
                    ref.addEventListener('mousemove', once(() => HoverSE.play()))
                )
            }}
            {...props}
        />
    )
}
