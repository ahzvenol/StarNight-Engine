import type { Reactive } from 'micro-reactive'
import type { Component, JSX } from 'solid-js'
import { children } from 'solid-js'

// 滑块组件,提供最大限度的自由配置,根据此组件父元素的width作为滑块长度
// 为了实现功能,此组件会修改以下属性,其余属性自由配置
// container.style.position = "relative"
// track.style.position = "absolute"
// thumb.style.position = "absolute"
// track.style.width = `${props.signal() * 100}%`
// thumb.style.left = `${props.signal() * 100}%`
// 或者有什么新点子可以实现滑块功能的话,这些属性也可以覆盖掉
const Slider: Component<{
    fill?: JSX.Element
    thumb: JSX.Element
    track: JSX.Element
    signal: Reactive<number>
    vertical?: boolean
}> = (props) => {
    const resolvedFill = children(() => props.fill ?? <div />).toArray()
    const resolvedThumb = children(() => props.thumb).toArray()
    const resolvedTrack = children(() => props.track).toArray()
    if (
        (resolvedFill.length !== 1 || typeof resolvedFill[0] !== 'object') &&
        (resolvedThumb.length !== 1 || typeof resolvedThumb[0] !== 'object') &&
        (resolvedTrack.length !== 1 || typeof resolvedTrack[0] !== 'object')
    ) {
        console.error('每个参数需要且仅需要一个HTMLElement')
        return <></>
    }

    const fill = resolvedFill[0]! as HTMLElement
    const thumb = resolvedThumb[0]! as HTMLElement
    const track = resolvedTrack[0]! as HTMLElement

    const vertical = props.vertical === undefined ? false : true

    track.style.position = 'relative'
    track.appendChild(fill)
    track.appendChild(thumb)
    fill.style.position = 'absolute'
    thumb.style.position = 'absolute'
    fill.style[vertical ? 'height' : 'width'] = `${props.signal() * 100}%`
    thumb.style[vertical ? 'top' : 'left'] = `${props.signal() * 100}%`

    thumb.onmousedown = thumb.ontouchstart = (event: MouseEvent | TouchEvent) => {
        event.stopPropagation()

        const max = track.getBoundingClientRect()[vertical ? 'height' : 'width']

        const fillLength = fill.getBoundingClientRect()[vertical ? 'height' : 'width']

        const start =
            event instanceof MouseEvent
                ? event[vertical ? 'clientY' : 'clientX']
                : event.changedTouches[0][vertical ? 'clientY' : 'clientX']

        const handler = (event: MouseEvent | TouchEvent) => {
            const current =
                event instanceof MouseEvent
                    ? event[vertical ? 'clientY' : 'clientX']
                    : event.changedTouches[0][vertical ? 'clientY' : 'clientX']

            const moveLength = current - start

            let percent = (fillLength + moveLength) / max
            if (percent <= 0) percent = 0
            else if (percent >= 1) percent = 1

            fill.style[vertical ? 'height' : 'width'] = `${percent * 100}%`
            thumb.style[vertical ? 'top' : 'left'] = `${percent * 100}%`

            props.signal(percent)
        }

        document.addEventListener('mousemove', handler as EventListener)
        document.addEventListener('touchmove', handler as EventListener)

        const clean = () => {
            document.removeEventListener('mousemove', handler as EventListener)
            document.removeEventListener('touchmove', handler as EventListener)
            document.removeEventListener('mouseup', clean)
            document.removeEventListener('touchend', clean)
        }
        document.addEventListener('mouseup', clean)
        document.addEventListener('touchend', clean)
    }

    return <>{track}</>
}

export default Slider
