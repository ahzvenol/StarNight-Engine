import type { Reactive } from 'micro-reactive-solid'
import type { Component, JSX } from 'solid-js'
import BScroll from '@better-scroll/core'
import MouseWheel from '@better-scroll/mouse-wheel'
import { useSignal } from 'micro-reactive-solid'
import { children, createEffect, getOwner, on, onCleanup, onMount, runWithOwner } from 'solid-js'
import { useEventListener } from '@/utils/solid/useEventListener'

BScroll.use(MouseWheel)

const Slider: Component<{
    fill?: JSX.Element
    thumb: JSX.Element
    track1: JSX.Element
    track2: JSX.Element
    signal: Reactive<number>
    vertical?: boolean
}> = (props) => {
    const resolvedFill = children(() => props.fill ?? <div />).toArray()
    const resolvedThumb = children(() => props.thumb).toArray()
    const resolvedTrack1 = children(() => props.track1).toArray()
    const resolvedTrack2 = children(() => props.track2).toArray()
    if (
        (resolvedFill.length !== 1 || typeof resolvedFill[0] !== 'object')
        && (resolvedThumb.length !== 1 || typeof resolvedThumb[0] !== 'object')
        && (resolvedTrack1.length !== 1 || typeof resolvedTrack1[0] !== 'object')
        && (resolvedTrack2.length !== 1 || typeof resolvedTrack2[0] !== 'object')
    ) {
        console.error('每个参数需要且仅需要一个HTMLElement')
        return <></>
    }

    const fill = resolvedFill[0]! as HTMLElement
    const thumb = resolvedThumb[0]! as HTMLElement
    const track1 = resolvedTrack1[0]! as HTMLElement
    const track2 = resolvedTrack2[0]! as HTMLElement

    const owner = getOwner()

    const vertical = props.vertical === undefined ? false : true

    track1.style.position = 'relative'
    track1.appendChild(fill)
    track1.appendChild(thumb)
    fill.style.position = 'absolute'
    thumb.style.position = 'absolute'

    createEffect(() => {
        fill.style[vertical ? 'height' : 'width'] = `${props.signal() * 100}%`
        thumb.style[vertical ? 'top' : 'left'] = `${props.signal() * 100}%`
    })

    const thumbHandler = (event: MouseEvent | TouchEvent) => {
        const max = track1.getBoundingClientRect()[vertical ? 'height' : 'width']

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

            const percent = Math.min(Math.max((fillLength + moveLength) / max, 0), 1)

            fill.style[vertical ? 'height' : 'width'] = `${percent * 100}%`
            thumb.style[vertical ? 'top' : 'left'] = `${percent * 100}%`

            props.signal(percent)
        }
        runWithOwner(owner, () => {
            const removeMouseMoveListener = useEventListener('mousemove', handler)
            const removeMouseUpListener = useEventListener('mouseup', clean)
            const removeTouchMoveListener = useEventListener('touchmove', handler, { target: thumb })
            const removeTouchEndListener = useEventListener('touchend', clean, { target: thumb })
            const removeTouchCancelListener = useEventListener('touchcancel', clean, { target: thumb })
            function clean() {
                removeMouseMoveListener()
                removeTouchMoveListener()
                removeMouseUpListener()
                removeTouchEndListener()
                removeTouchCancelListener()
            }
        })
    }
    const trackHandler = (event: MouseEvent) => {
        const max = track1.getBoundingClientRect()[vertical ? 'height' : 'width']

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
    }
    useEventListener('click', trackHandler, { target: track2 })
    useEventListener('mousedown', thumbHandler, { target: thumb })
    useEventListener('touchstart', thumbHandler, { target: thumb })

    return <>{track2}</>
}

const Scrollbar: Component<{
    container: JSX.Element
    content: JSX.Element
    track: JSX.Element
    thumb: JSX.Element
    default?: number
}> = (props) => {
    const resolvedContainer = children(() => props.container).toArray()
    const resolvedTrack = children(() => props.track).toArray()
    const resolvedThumb = children(() => props.thumb).toArray()
    if (
        (resolvedContainer.length !== 1 || typeof resolvedContainer[0] !== 'object')
        && (resolvedTrack.length !== 1 || typeof resolvedTrack[0] !== 'object')
        && (resolvedThumb.length !== 1 || typeof resolvedThumb[0] !== 'object')
    ) {
        console.error('每个参数需要且仅需要一个HTMLElement')
        return <></>
    }
    const percent = useSignal(props.default ?? 0)
    const container = resolvedContainer[0]! as HTMLElement
    const track = resolvedTrack[0]! as HTMLElement
    const thumb = resolvedThumb[0]! as HTMLElement

    // 使用一个盒子在容器内部移动达成滚动效果
    const box = document.createElement('div')
    children(() => props.content)
        .toArray()
        .filter((e) => e instanceof HTMLElement)
        .forEach((e) => box.appendChild(e))
    container.appendChild(box)

    // 盒子的高度必须是auto
    box.style.height = 'auto'

    // 把传入的轨道元素作为背景,使用新的元素限制滑块滚动距离
    const el = document.createElement('div')
    track.appendChild(el)

    onMount(() => {
        const bs = new BScroll(container, {
            scrollY: true,
            click: true,
            mouseWheel: true,
            bounce: false,
            probeType: 3
        })

        // scrollHeight自己还会变,预先保存下来
        const contentDimension = container.scrollHeight
        // 轨道的定义长度
        const trackDimension = parseInt(getComputedStyle(track).getPropertyValue('height'))
        // 滑块的长度/轨道长度 = 内容可见长度/内容总长度
        const thumbDimension = (container.clientHeight / contentDimension) * trackDimension
        thumb.style.height = `${thumbDimension}px`

        // 继承传入的轨道元素不变方向的长度
        el.style.width = `${parseInt(getComputedStyle(track).getPropertyValue('width'))}px`
        // 为了使滑块不超出轨道,新的轨道长度是原轨道长度减去滑块的长度
        el.style.height = `${trackDimension - thumbDimension}px`
        // 滑动滑块时,修改盒子定位,移动距离是:
        // 不可见的长度和总长度的比 * 内容长度和容器长度的比 * 滑动条得到的百分比 * 100

        let isScroll = false
        bs.scrollTo(0, percent() * bs.maxScrollY)
        createEffect(
            on(
                percent,
                () => {
                    if (!isScroll) {
                        bs.scrollTo(0, percent() * bs.maxScrollY)
                    }
                },
                { defer: true }
            )
        )

        const update = (position: { x: number, y: number }) => percent(position.y / bs.maxScrollY)

        bs.on('scroll', update)
        bs.on('mousewheelMove', update)
        bs.on('mousewheelStart', () => (isScroll = true))
        bs.on('scrollStart', () => (isScroll = true))
        bs.on('scrollEnd', () => (isScroll = false))
        bs.on('scrollCancel', () => (isScroll = false))
        bs.on('mousewheelEnd', () => (isScroll = false))
        onCleanup(() => bs.destroy())
    })

    return (
        <>
            {container}
            <Slider vertical track1={el} track2={track} thumb={thumb} signal={percent} />
        </>
    )
}

export { Scrollbar }
