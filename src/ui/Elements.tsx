import type { Component, JSX } from 'solid-js'
import { isPlainObject, range } from 'es-toolkit'
import { For, splitProps } from 'solid-js'
import { UISE } from '@/store/audio'
import { useEventListener } from '@/utils/solid/useEventListener'
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

const ClickSE = UISE({ src: './static/mouse_click_1.wav' })
const HoverSE = UISE({ src: './static/mouse_hover_1.wav' })

const Button: Component<Omit<JSX.HTMLAttributes<HTMLDivElement>, 'ref'>> = (props) => {
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

const Content: Component<JSX.HTMLAttributes<HTMLDivElement>> = (props) => {
    const [local, others] = splitProps(props, ['style'])
    return (
        <div
            style={
                isPlainObject(local.style)
                    ? { ...local.style, display: 'contents' }
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
