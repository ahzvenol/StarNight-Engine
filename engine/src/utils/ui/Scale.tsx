import type { Component, ParentProps } from 'solid-js'
import { createEffect, on, onMount, splitProps } from 'solid-js'
import { useEventListener } from '@/utils/solid/useEventListener'

export type ScaleMode = 'fill' | 'fit-ratio'

export const Scale: Component<ParentProps<{ width: number, height: number, mode: ScaleMode }>> = (props) => {
    let el!: HTMLDivElement, slot!: HTMLDivElement
    function resize() {
        const width = el.clientWidth, height = el.clientHeight
        if (props.mode === 'fill') {
            slot.style.setProperty('transform', `scale(${width / props.width},${height / props.height})`)
        } else {
            if (width / height >= props.width / props.height) {
                const scale = height / props.height
                slot.style.setProperty('transform', `translateX(${(width - props.width * scale) / 2}px) scale(${scale})`)
            } else {
                const scale = width / props.width
                slot.style.setProperty('transform', `translateY(${(height - props.height * scale) / 2}px) scale(${scale})`)
            }
        }
    }
    onMount(() => (resize(), useEventListener('resize', resize)))
    const config = splitProps(props, ['children'])[1]
    createEffect(on(() => Object.values(config), resize, { defer: true }))
    return (
        <div ref={el} style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'absolute' }}>
            <div ref={slot} style={{ position: 'absolute', width: `${props.width}px`, height: `${props.height}px`, 'transform-origin': '0 0' }}>
                {props.children}
            </div>
        </div>
    )
}
