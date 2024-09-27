import type { Component, ParentProps } from 'solid-js'
import { onCleanup, children } from 'solid-js'

const Scale: Component<ParentProps<{ width: number; height: number; mode: 'auto' | 'full' | unknown }>> = (props) => {
    let intervalId!: NodeJS.Timer
    const resolved = children(() => props.children)
    const array = resolved.toArray()
    if (array.length !== 1 || typeof array[0] !== 'object') throw Error('需要且仅需要一个HTMLElement')
    const slot = array[0]! as HTMLElement
    const autoResize = (el: HTMLDivElement) => {
        slot.style.transformOrigin = '0px 0px'
        slot.style.width = props.width + 'px'
        slot.style.height = props.height + 'px'
        slot.style.position = 'absolute'
        const resize = () => {
            const width = parseInt(getComputedStyle(el).getPropertyValue('width'))
            const height = parseInt(getComputedStyle(el).getPropertyValue('height'))
            if (props.mode == 'auto') {
                if (width / height >= props.width / props.height) {
                    const scale = height / props.height
                    slot.style.transform = `scale(${scale}) translate(${(width - props.width * scale) / 2 / scale}px,0)`
                } else {
                    const scale = width / props.width
                    slot.style.transform = `scale(${scale}) translate(0,${(height - props.height * scale) / 2 / scale}px)`
                }
            } else if (props.mode == 'full') {
                slot.style.transform = `scale(${width / props.width},${height / props.height})`
            } else {
                throw Error("mode应该是'auto'或'full'")
            }
        }
        resize()
        setTimeout(resize, 100)
        setTimeout(resize, 200)
        window.addEventListener('resize', resize)
        // test:考虑在一些设备上的显示错乱是执行时机问题
        intervalId = setInterval(resize, 500)
    }
    onCleanup(() => {
        clearInterval(intervalId)
    })
    return (
        <div ref={autoResize} style="width: 100%;height: 100%;overflow: hidden;position: absolute;z-index: 9;">
            {slot}
        </div>
    )
}

export default Scale
