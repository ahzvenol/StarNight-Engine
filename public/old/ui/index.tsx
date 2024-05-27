import type { Signal } from 'micro-reactive'
import { useReactive } from 'micro-reactive'
import type { Component } from 'solid-js'
import { onCleanup, onMount, Show } from 'solid-js'
import Element from './elements/Element'
import Scale from './Scale'

// todo 因为生成器本质上是往元素上挂标签,所以规定一个anyGenerator,接受一组Generator
// todo 把底下这部分套起来变成一个大函数,接收Graphics对象,把宽高取出来给Scale,里面循环createElement(new Element(child))
// 包括全局css,全局变量等都可以在这时进行注入了
// 根据willConfig里的内容，目前看来这些变量倒是大部分不需要做成全局变量的,不过因为是config中的内容,考虑从config的初始化之后注入到全局变量
// 先测试纯UI，再放置逻辑
// messageOpacity可能有点麻烦，要改css,同时这个元素并不在dom树上
// 游戏核心运行时才读取的变量倒是无所谓了，关键是其他的 //也即修改的同时就要生效而无法提前配置读取的部分
// CG配置，这个看起来没问题了
// 没有路由,这是比较麻烦的,总之keep-alive得弄出来,应该还得是可选的配置 //Vue版本为路由传参,根据参数不同还有一些变化,这次要考虑全用变量实现了
// 手动测试完完整实现之后,进行控件的封装,这时候//system定义才比较的发挥作用
// 之后测试其他gal的UI制作,测试通过即UI的纯配置文件封装完毕
// 变量与其使用相关的函数可以考虑封装成一组，同时这样可以满足“stage.js”的定义

interface Graphics {
    "type": "graphics",
    "width": number,
    "height": number,
    "globalCss"?: string
    // 全局函数和全局变量都可以挂上
    "children"?: []
}

type Info = Element & { varMap?: ObjectMap<Signal<any>>, functionMap?: ObjectMap }

const parser = new (less.Parser)

function parseLess(style: string): Signal<any> {
    let s = useReactive("")
    parser.parse(style, function (err: any, tree: any) {
        s(tree.toCSS({ compress: true }))
    })
    return s
}

const createElement: Component<Info> = function (props) {
    let map1 = { ...props.varMap, ...props.createVar() }
    let map2 = { ...props.functionMap }
    props.__proto__ = { varMap: map1, functionMap: map2 }
    const Element: Component = () => {
        let self: any
        onMount(() => {
            queueMicrotask(() => { props.onMount(self) })
        })
        onCleanup(() => {
            queueMicrotask(() => { props.onMount(self) })
        })
        // 之后使用{...obj}语法代替,目前主要为了标识所需内容用
        return <div
            ref={self}
            id={props.id}
            class={props.class}
            onclick={props.onclick}>
            <style>{parseLess(props.style)()}</style>
            {props.children.flatMap(e => createElement(Object.setPrototypeOf(e, props.__proto__)))}
        </div>
    }
    return <Show when={props.when()}><Element /></Show>
}

const UIRender: Component<{ graphics: Graphics }> = (props) => {
    const graphics = props.graphics
    const globalVars = { varMap: {} }
    const globalunctions = { functionMap: {} }

    return <Scale width={graphics.width} height={graphics.height} mode="auto">
        <div>
            <style>{parseLess(graphics.globalCss || "")()}</style>
            {graphics.children?.map(e => createElement(new Element(e)))}
        </div>
    </Scale>
}

export default UIRender