import type { CommandArg } from '@/core/types/Command'
import { isNotNil, mapValues } from 'es-toolkit'
import { match } from 'ts-pattern'
import { PostInitEvent } from '@/core/event'
import { Dynamic, NonBlocking } from '@/core/flow'
import { GameState } from '@/core/types/Game'
import { Scope, useAutoResetSignal } from '@/core/utils/useScopeSignal'
import { Y } from '@/utils/FPUtil'
import { _tween } from './abstract/tween'

// 跨幕环境变量file,需要收集副作用
export type SetImageCommandArgs = {
    name: string
    file: string
    ease?: string
    duration?: number
    x?: number
    y?: number
    z?: number
    w?: number
    h?: number
}

export const stageView = useAutoResetSignal<HTMLDivElement>(() => document.createElement('div'), Scope.Game)

PostInitEvent.subscribe(() =>
    Y<Element, void>((rec) => (displayObject) => {
        Array.from(displayObject.children).forEach(rec)
        if (displayObject instanceof HTMLImageElement) {
            displayObject.src = displayObject.getAttribute('meta')!
        }
    })(stageView())
)

// z,w,h可选,若不设定则默认在最上层,保持图片原宽高
export const setImage = Dynamic<SetImageCommandArgs>(
    (context) =>
        function* ({ name, file, ease, duration = 0, x = 0, y = 0, z = 1, w, h }) {
            const { state } = context
            const stage = stageView()
            const array = stage.getElementsByClassName(name)
            const bitmap = match(state)
                // @ts-expect-error 类型“ImgHTMLAttributes<HTMLImageElement>”上不存在属性“attr:meta”
                .with(GameState.Init, () => <img attr:meta={file} />)
                .otherwise(() => <img src={file} />) as HTMLImageElement
            const oldBitmap = array[0] as HTMLImageElement | null
            bitmap.className = name
            bitmap.style.translate =
                x !== undefined && y !== undefined ? `${x}px ${y}px` : oldBitmap?.style?.translate || ''
            bitmap.style.zIndex = `${z}`
            if (w !== undefined) bitmap.style.width = `${w}px`
            if (h !== undefined) bitmap.style.height = `${h}px`
            stage.insertBefore(bitmap, stage.firstChild)
            if (isNotNil(oldBitmap)) {
                if (state !== GameState.Init) {
                    const sequence = _tween({ target: oldBitmap, ease, duration })({ opacity: 0 })
                    yield sequence.finished
                }
                oldBitmap.parentNode?.removeChild(oldBitmap)
            }
        }
)

export type TweenImageCommandArgs = {
    target: string
    ease?: string
    duration?: number
} & Record<string, CommandArg>

export const tweenImage = Dynamic<TweenImageCommandArgs>(
    () =>
        function* ({ target, ease, duration = 0, ...args }) {
            if (args.x !== undefined) {
                args.translateX = args.x
                delete args.x
            }
            if (args.y !== undefined) {
                args.translateY = args.y
                delete args.y
            }

            const tweenTarget = stageView().getElementsByClassName(target)[0]
            const sequence = _tween({ target: tweenTarget, ease, duration })(mapValues(args, (arg) => '+=' + arg))
            yield sequence.finished
            sequence.seek(sequence.duration)
        }
)

export type CloseImageCommandArgs = XOR<{ target: string }, { exclude?: string }>

export const closeImage = NonBlocking<CloseImageCommandArgs>(() => ({ target, exclude }) => {
    if (target) {
        stageView().removeChild(stageView().getElementsByClassName(target)[0])
    } else {
        Array.from(stageView().children).forEach((e) => {
            if (e.className !== exclude) stageView().removeChild(e)
        })
    }
})
