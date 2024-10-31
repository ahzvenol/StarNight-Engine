import { Component, JSX, children, createEffect, onMount } from 'solid-js'
import { Portal } from 'solid-js/web'
import { useSignal } from '@/utils/Reactive'
import Slider from './Slider'

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
        (resolvedContainer.length !== 1 || typeof resolvedContainer[0] !== 'object') &&
        (resolvedTrack.length !== 1 || typeof resolvedTrack[0] !== 'object') &&
        (resolvedThumb.length !== 1 || typeof resolvedThumb[0] !== 'object')
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

    // 把传入的轨道元素作为背景,使用新的元素限制滑块滚动距离
    const el = document.createElement('div')
    track.appendChild(el)

    onMount(() => {
        const containerDimension = parseInt(getComputedStyle(container).getPropertyValue('height'))
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
        createEffect(() => {
            box.style.top =
                '-' +
                percent() *
                    ((contentDimension - container.clientHeight) / contentDimension) *
                    (contentDimension / containerDimension) *
                    100 +
                '%'
        })
    })
    return (
        <>
            {container}
            {track}
            <Portal mount={track}>
                <Slider vertical track={el} thumb={thumb} signal={percent} />
            </Portal>
        </>
    )
}

export default Scrollbar
