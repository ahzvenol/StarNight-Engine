import type { Component, JSX } from 'solid-js'
import { isPlainObject, range } from 'es-toolkit'
import { For, splitProps } from 'solid-js'

//横行竖列
//给出总行数，返回每个index对应的行数
const line = (x: number) => (index: number) => (index % x) + 1
//给出总列数，返回每个index对应的列数
const column = (x: number) => (index: number) => Math.ceil((index + 1) / x)

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

export { Content, Clone, Variable, column, line }
