import type { Component, JSX } from 'solid-js'
import { isPlainObject, range } from 'es-toolkit'
import { Howl } from 'howler'
import { For, splitProps } from 'solid-js'
import { useAudio } from '@/store/hooks/useAudio'
import { stopPropagation } from '@/utils/solid/stopPropagation'
import Scale from './Scale'

//横行竖列
//给出总行数，返回每个index对应的行数
const line = (x: number) => (index: number) => (index % x) + 1
//给出总列数，返回每个index对应的列数
const column = (x: number) => (index: number) => Math.ceil((index + 1) / x)

const Graphic = (props: { width: number; height: number; mode: 'auto' | 'full'; children: JSX.Element }) => (
    <div style={{ width: '100vw', height: '100vh', 'background-color': '#000' }}>
        <Scale width={props.width} height={props.height} mode={props.mode}>
            {props.children}
        </Scale>
    </div>
)

const ClickSE = useAudio('UISE', new Howl({ src: './static/mouse_click_1.wav' }))
const HoverSE = useAudio('UISE', new Howl({ src: './static/mouse_hover_1.wav' }))

const Button: Component<
    Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onclick' | 'onmouseenter'> & {
        onClick?: Function0<void>
        onMouseEnter?: Function0<void>
    }
> = (props) => {
    const [local, others] = splitProps(props, ['onClick', 'onMouseEnter'])
    return (
        <div
            onClick={stopPropagation(() => {
                ClickSE.play()
                local.onClick?.()
            })}
            onMouseEnter={() => {
                HoverSE.play()
                local.onMouseEnter?.()
            }}
            {...others}
        />
    )
}

const Content: Component<JSX.HTMLAttributes<HTMLDivElement>> = (props) => {
    const [local, others] = splitProps(props, ['style'])
    return (
        <div
            style={
                isPlainObject(local.style)
                    ? {
                          ...(local.style as JSX.CSSProperties),
                          display: 'contents'
                      }
                    : local.style + ';display:contents;'
            }
            {...others}
        />
    )
}

const Variable = <T,>(props: { value: T; children: (value: T) => JSX.Element }) => props.children(props.value)

const Clone = (props: { count: number; children: (index: number) => JSX.Element }) => (
    <For each={range(0, props.count)}>{(index) => props.children(index)}</For>
)

export { Button, Content, Clone, Graphic, Variable, column, line }
