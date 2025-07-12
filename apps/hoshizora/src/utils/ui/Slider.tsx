import type { Reactive } from 'micro-reactive-solid'
import type { Component, JSX } from 'solid-js'
import { children, createEffect, getOwner, runWithOwner } from 'solid-js'
import { useEventListener } from '@/utils/solid/useEventListener'

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
    onSlideStart?: (event: MouseEvent | TouchEvent) => void
    onSlideEnd?: (event: MouseEvent | TouchEvent) => void
    onTrackClick?: (event: MouseEvent) => void
}> = (props) => {
    const resolvedFill = children(() => props.fill ?? <div />).toArray()
    const resolvedThumb = children(() => props.thumb).toArray()
    const resolvedTrack = children(() => props.track).toArray()
    if (
        (resolvedFill.length !== 1 || typeof resolvedFill[0] !== 'object')
        && (resolvedThumb.length !== 1 || typeof resolvedThumb[0] !== 'object')
        && (resolvedTrack.length !== 1 || typeof resolvedTrack[0] !== 'object')
    ) {
        console.error('每个参数需要且仅需要一个HTMLElement')
        return <></>
    }

    const fill = resolvedFill[0]! as HTMLElement
    const thumb = resolvedThumb[0]! as HTMLElement
    const track = resolvedTrack[0]! as HTMLElement

    const owner = getOwner()

    const vertical = props.vertical === undefined ? false : true

    track.style.position = 'relative'
    track.appendChild(fill)
    track.appendChild(thumb)
    fill.style.position = 'absolute'
    thumb.style.position = 'absolute'

    createEffect(() => {
        fill.style[vertical ? 'height' : 'width'] = `${props.signal() * 100}%`
        thumb.style[vertical ? 'top' : 'left'] = `${props.signal() * 100}%`
    })

    const thumbHandler = (event: MouseEvent | TouchEvent) => {
        const max = track.getBoundingClientRect()[vertical ? 'height' : 'width']

        const fillLength = fill.getBoundingClientRect()[vertical ? 'height' : 'width']

        const start =
            event instanceof MouseEvent
                ? event[vertical ? 'clientY' : 'clientX']
                : event.changedTouches[0][vertical ? 'clientY' : 'clientX']

        props.onSlideStart?.(event)

        const handler = (event: MouseEvent | TouchEvent) => {
            const current =
                event instanceof MouseEvent
                    ? event[vertical ? 'clientY' : 'clientX']
                    : event.changedTouches[0][vertical ? 'clientY' : 'clientX']

            const moveLength = current - start

            const percent = Math.min(Math.max((fillLength + moveLength) / max, 0), 1)

            fill.style[vertical ? 'height' : 'width'] = `${percent * 100}%`
            thumb.style[vertical ? 'top' : 'left'] = `${percent * 100}%`

            props.signal(percent)
        }
        runWithOwner(owner, () => {
            const removeMouseMoveListener = useEventListener('mousemove', handler)
            const removeTouchMoveListener = useEventListener('touchmove', handler, { target: thumb })
            const removeMouseUpListener = useEventListener('mouseup', clean)
            const removeLeaveUpListener = useEventListener('mouseleave', clean)
            const removeTouchEndListener = useEventListener('touchend', clean, { target: thumb })
            const removeTouchCancelListener = useEventListener('touchcancel', clean, { target: thumb })
            function clean() {
                props.onSlideEnd?.(event)

                removeMouseMoveListener()
                removeTouchMoveListener()
                removeMouseUpListener()
                removeLeaveUpListener()
                removeTouchEndListener()
                removeTouchCancelListener()
            }
        })
    }
    const trackHandler = (event: MouseEvent) => {
        const max = track.getBoundingClientRect()[vertical ? 'height' : 'width']

        const fillLength = fill.getBoundingClientRect()[vertical ? 'height' : 'width']

        const start =
            thumb.getBoundingClientRect()[vertical ? 'top' : 'left']
            + thumb.getBoundingClientRect()[vertical ? 'height' : 'width'] / 2

        const current = event[vertical ? 'clientY' : 'clientX']

        const moveLength = current - start

        const percent = Math.min(Math.max((fillLength + moveLength) / max, 0), 1)

        fill.style[vertical ? 'height' : 'width'] = `${percent * 100}%`
        thumb.style[vertical ? 'top' : 'left'] = `${percent * 100}%`

        props.signal(percent)

        props.onTrackClick?.(event)
    }
    useEventListener('click', trackHandler, { target: track })
    useEventListener('mousedown', thumbHandler, { target: thumb })
    useEventListener('touchstart', thumbHandler, { target: thumb })

    return <>{track}</>
}

export { Slider }
