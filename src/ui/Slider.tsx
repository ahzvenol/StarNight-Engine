import { Reactive } from "micro-reactive"
import { Component, JSX, children, onMount } from "solid-js"

// 滑块组件,提供最大限度的自由配置,根据此组件父元素的width作为滑块长度
// 为了实现功能,此组件会修改以下属性,其余属性自由配置
// parent.style.position = "relative"
// track.style.position = "absolute"
// track.style.translate = "0 -50%"
// thumb.style.position = "absolute"
// thumb.style.translate = "-50% -50%"
// track.style.width = `${props.signal() * 100}%`
// thumb.style.left = `${props.signal() * 100}%`
// 或者有什么新点子可以实现滑块功能的话,这些属性也可以覆盖掉
const Slider: Component<{ track: JSX.Element, thumb: JSX.Element, signal: Reactive<number> }> =
    (props) => {
        const resolvedTrack = children(() => props.track).toArray()
        const resolvedThumb = children(() => props.thumb).toArray()
        if (
            (
                resolvedTrack.length !== 1 || typeof resolvedTrack[0] !== 'object'
            ) && (
                resolvedThumb.length !== 1 || typeof resolvedThumb[0] !== 'object'
            )
        ) {
            console.error("每个参数需要且仅需要一个HTMLElement")
            return <></>
        }


        const track = resolvedTrack[0]! as HTMLElement
        const thumb = resolvedThumb[0]! as HTMLElement

        onMount(() => {
            if (!track.parentElement) {
                console.error("滑块需要一个类型为HTMLElement的父元素")
                return <></>
            }

            const parent = track.parentElement

            parent.style.position = "relative"
            track.style.position = "absolute"
            track.style.translate = "0 -50%"
            thumb.style.position = "absolute"
            thumb.style.translate = "-50% -50%"
            track.style.width = `${props.signal() * 100}%`
            thumb.style.left = `${props.signal() * 100}%`

            thumb.onmousedown = thumb.ontouchstart =
                (event: MouseEvent | TouchEvent) => {
                    event.stopPropagation()

                    // 需要判断box-sizing等
                    const max = parent.getBoundingClientRect().width

                    const trackWidth = track.getBoundingClientRect().width

                    const startX = event instanceof MouseEvent
                        ? event.clientX
                        : event.changedTouches[0].clientX

                    const handler =
                        (event: MouseEvent | TouchEvent) => {
                            const currentX = event instanceof MouseEvent
                                ? event.clientX
                                : event.changedTouches[0].clientX

                            const moveX = currentX - startX

                            let percent = (trackWidth + moveX) / max
                            if (percent <= 0) percent = 0
                            else if (percent >= 1) percent = 1

                            track.style.width = `${percent * 100}%`
                            thumb.style.left = `${percent * 100}%`

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
        })

        return <>{track}{thumb}</>
    }

export default Slider