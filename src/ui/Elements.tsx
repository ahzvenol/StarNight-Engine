import { clickSoundEffect, hoverSoundEffect } from '@/store/audioManager'
import { Store } from '@/store/default'
import { ObjectUtils } from "@/utils/ObjectUtils"
import { range } from 'es-toolkit'
import type { Component } from 'solid-js'
import { Index, JSX, splitProps } from 'solid-js'
import { getUuid } from "../utils"
import Scale from "./Scale"

//横行竖列
//给出总行数，返回每个index对应的行数
const line = (x: number) => (index: number) => (index % x) + 1
//给出总列数，返回每个index对应的列数
const column = (x: number) => (index: number) => Math.ceil((index + 1) / x)

const Element: Component<JSX.HTMLAttributes<HTMLDivElement>> = (props) => {
    if (props.style && ObjectUtils.isObject(props.style)) {
        const pseudoClassesStyleObject = ObjectUtils.fitter(props.style)(([_, v]) => ObjectUtils.isObject(v))
        if (ObjectUtils.isNotEmpty(pseudoClassesStyleObject)) {
            const uuid = getUuid().replace(/^[^a-zA-Z]*/, '')
            const pseudoClassesStyleString =
                Object.entries(pseudoClassesStyleObject)
                    .map(([key, value]) =>
                        `.${uuid}${key} {
                            ${Object.entries(value!).map(([property, value]) => `${property}: ${value}!important;`).join(' ')}
                        }`)

                    .join(' ')
            props.class = props.class ? props.class + ' ' + uuid : uuid
            return <>
                <style>{pseudoClassesStyleString}</style>
                <div {...props}></div>
            </>
        }
    }
    return <div  {...props}></div>
}

const Button: Component<JSX.HTMLAttributes<HTMLDivElement> & { onclick?: Function0<void>, onmouseenter?: Function0<void> }> =
    (props) => {
        const [local, others] = splitProps(props, ["classList", "onclick", "onmouseenter"])
        return <div
            classList={{ ...local.classList }}
            onclick={() => {
                clickSoundEffect()
                local.onclick?.()
            }}
            onmouseenter={() => {
                hoverSoundEffect()
                local.onmouseenter?.()
            }}
            {...others}
        />
    }

const Graphic =
    (props: { config: Store['system'], children: JSX.Element }) =>
        <Element style="width: 100vw;height: 100vh;background-color: #000;">
            <Scale
                width={props.config['width']()}
                height={props.config['height']()}
                mode={props.config['mode']()}
            >
                <Element>
                    {props.children}
                </Element>
            </Scale>
        </Element>

const Variable =
    <T,>(props: { value: T, children: (value: T) => JSX.Element }) => props.children(props.value)

const Clone =
    (props: { count: number, children: (index: number) => JSX.Element }) =>
        <Index each={range(0, props.count)}>{(index) => props.children(index())}</Index>

export { Button, Clone, Element, Graphic, Variable, column, line }
