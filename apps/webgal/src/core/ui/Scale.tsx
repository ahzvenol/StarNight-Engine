import type { Component, ParentProps } from 'solid-js'
import { onMount } from 'solid-js'
import { useEventListener } from '@/utils/solid/useEventListener'

export const Scale: Component<ParentProps<{ width: number, height: number, mode: 'auto' | 'full' }>> = (props) => {
    let el!: HTMLDivElement
    let slot!: HTMLDivElement
    function resize() {
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
        } else {
            slot.style.transform = `scale(${width / props.width},${height / props.height})`
        }
    }
    onMount(() => {
        slot.style.transformOrigin = '0px 0px'
        slot.style.width = props.width + 'px'
        slot.style.height = props.height + 'px'
        slot.style.position = 'absolute'
        resize()
        useEventListener('resize', resize)
    })
    return (
        <div ref={el} style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'absolute' }}>
            <div ref={slot}>{props.children}</div>
        </div>
    )
}
