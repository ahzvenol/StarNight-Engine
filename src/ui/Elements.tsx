import type { Component, JSX } from 'solid-js'
import type { ReactiveStore } from '@/store/default'
import { range } from 'es-toolkit'
import { For, splitProps } from 'solid-js'
import click from '@/assets/mouse_click_1.wav'
import hover from '@/assets/mouse_hover_1.wav'
import { useAudioConfig } from '@/store/hooks/useAudioConfig'
import Scale from './Scale'

//横行竖列
//给出总行数，返回每个index对应的行数
const line = (x: number) => (index: number) => (index % x) + 1
//给出总列数，返回每个index对应的列数
const column = (x: number) => (index: number) => Math.ceil((index + 1) / x)

// 好像修改调用的函数导致出现了一些问题,目前看并没有发挥作用的情况下暂时弃用它
// const Element: Component<JSX.HTMLAttributes<HTMLDivElement>> = (props) => {
//     if (props.style && ObjectUtils.isObject(props.style)) {
//         const pseudoClassesStyleObject = omitBy(props.style, (value) => ObjectUtils.isObject(value))
//         if (ObjectUtils.isNotEmpty(pseudoClassesStyleObject)) {
//             const uuid = crypto.randomUUID().replace(/^[^a-zA-Z]*/, '')
//             const pseudoClassesStyleString = Object.entries(pseudoClassesStyleObject)
//                 .map(
//                     ([key, value]) =>
//                         `.${uuid}${key} {
//                             ${Object.entries(value!)
//                                 .map(([property, value]) => `${property}: ${value}!important;`)
//                                 .join(' ')}
//                         }`
//                 )

//                 .join(' ')
//             props.class = props.class ? props.class + ' ' + uuid : uuid
//             return (
//                 <>
//                     <style>{pseudoClassesStyleString}</style>
//                     <div {...props}></div>
//                 </>
//             )
//         }
//     }
//     return <div {...props}></div>
// }

const Graphic = (props: { config: ReactiveStore['system']; children: JSX.Element }) => (
    <div style={{ width: '100vw', height: '100vh', 'background-color': '#000' }}>
        <Scale width={props.config.width()} height={props.config.height()} mode={props.config.mode()}>
            <div>{props.children}</div>
        </Scale>
    </div>
)

const ClickSE = useAudioConfig('UISE', new Howl({ src: click }))
const HoverSE = useAudioConfig('UISE', new Howl({ src: hover }))

const Button: Component<
    JSX.HTMLAttributes<HTMLDivElement> & {
        onClick?: Function0<void>
        onMouseEnter?: Function0<void>
    }
> = (props) => {
    const [local, others] = splitProps(props, ['classList', 'onClick', 'onMouseEnter'])
    return (
        <div
            classList={{ ...local.classList }}
            onClick={(e) => {
                e.stopPropagation()
                ClickSE.play()
                local.onClick?.()
            }}
            onMouseEnter={() => {
                HoverSE.play()
                local.onMouseEnter?.()
            }}
            {...others}
        />
    )
}

const Variable = <T,>(props: { value: T; children: (value: T) => JSX.Element }) => props.children(props.value)

const Clone = (props: { count: number; children: (index: number) => JSX.Element }) => (
    <For each={range(0, props.count)}>{(index) => props.children(index)}</For>
)

export { Button, Clone, Graphic, Variable, column, line }
