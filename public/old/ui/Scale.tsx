import type { Component, JSX } from 'solid-js'
import { onCleanup, onMount } from 'solid-js'

const getLength = (element: HTMLElement, attr: string) => {
    //@ts-ignore
    if (element.currentStyle) {
        //@ts-ignore
        return parseInt(element.currentStyle[attr])
    } else {
        return parseInt(getComputedStyle(element, null)[attr])
    }
}
const Scale: Component<{
    width: number,
    height: number,
    mode: 'auto' | 'full',
    readonly children: JSX.IntrinsicElements | any
}> = (props) => {
    let self!: HTMLDivElement
    let slot = props.children
    let intervalId: NodeJS.Timer
    onMount(() => {
        queueMicrotask(() => {
            slot.style.transformOrigin = '0px 0px'
            slot.style.width = props.width + 'px'
            slot.style.height = props.height + 'px'
            slot.style.position = 'absolute'
            const resize = () => {
                let width = getLength(self, 'width')
                let height = getLength(self, 'height')
                if (props.mode == 'auto') {
                    if (width / height >= props.width / props.height) {
                        let scale = height / props.height
                        slot.style.transform = `scale(${scale}) translate(${(width - props.width * scale) / 2 / scale}px,0)`
                    } else {
                        let scale = width / props.width
                        slot.style.transform = `scale(${scale}) translate(0,${(height - props.height * scale) / 2 / scale}px)`
                    }
                } else if (props.mode == 'full') {
                    slot.style.transform = `scale(${width / props.width},${height / props.height})`
                }
            }
            resize()
            window.addEventListener('resize', resize)
            // test:考虑在一些设备上的显示错乱是执行时机问题
            intervalId = setInterval(resize, 500)
        })
    })
    onCleanup(() => { clearInterval(intervalId) })
    return <div ref={self} style="width: 100%;height: 100%;overflow: hidden;position: absolute;">{slot}</div>
}

export default Scale