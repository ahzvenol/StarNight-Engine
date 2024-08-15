import { NavigateOptions, Router, Routes, Route as SolidRoute, useNavigate } from "@solidjs/router"
import type { Reactive } from 'micro-reactive'
import type { Component } from 'solid-js'
import { Index, JSX } from 'solid-js'
import { ObjectUtils, getUuid, to } from "../util"
import Scale from "./Scale"

//横行竖列
//给出总行数，返回每个index对应的行数
const line = (x: number) => (index: number) => (index % x) + 1
//给出总列数，返回每个index对应的列数
const column = (x: number) => (index: number) => Math.ceil((index + 1) / x)

// const navigate = (to: string, options?: Partial<NavigateOptions<unknown>> | undefined) => useNavigate()(to, options)
const navigate = (to: string) => location.href = to

const Route = <U extends JSX.Element>
    ({ path, children }: { path: string, children: () => U }) =>
    <SolidRoute path={path} component={children} />

const Element: Component<JSX.HTMLAttributes<HTMLDivElement>> = (props) => {
    if (props.style && ObjectUtils.isObject(props.style)) {
        const pseudoClassesStyleObject = ObjectUtils.fitter(props.style)(([_, v]) => ObjectUtils.isObject(v))
        if (ObjectUtils.isNotEmpty(pseudoClassesStyleObject)) {
            const uuid = getUuid().replace(/^[^a-zA-Z]*/, '')
            const pseudoClassesStyleString =
                Object.entries(pseudoClassesStyleObject)
                    .map(([key, value]) =>
                        `.${uuid}${key} {
                            ${Object.entries(value).map(([property, value]) => `${property}: ${value}!important;`).join(' ')}
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

const Graphics = <U extends JSX.Element>
    ({ config, children }: { config: Reactive<Dictionary>, children: U }) =>
    <Element style="width: 100vw;height: 100vh;background-color: #000;">
        <Router>
            <Scale
                width={config()['width']}
                height={config()['height']}
                mode={config()['mode']}
            >
                <Element>
                    <Routes>{children}</Routes>
                </Element>
            </Scale>
        </Router>
    </Element>

const Variable = <T, U extends JSX.Element>
    ({ value, children }: { value: T, children: (value: T) => U }) => children(value)

const Clone = <U extends JSX.Element>
    ({ count, children }: { count: number, children: (index: number) => U }) =>
    <Index each={to(0, count - 1)}>{(index) => children(index())}</Index>


export { Clone, Element, Graphics, Route, Variable, column, line, navigate }