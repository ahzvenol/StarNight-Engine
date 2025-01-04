import { isNotNil, mapValues } from 'es-toolkit'
import { PostInitEvent } from '@/core/event'
import { Dynamic, NonBlocking } from '@/core/normalize'
import { GameState } from '@/core/types/Game'
import { Scope, useAutoResetSignal } from '@/core/utils/useScopeSignal'
import { Y } from '@/utils/fp'
import { _tween } from './abstract/tween'

export const stageView = useAutoResetSignal<HTMLDivElement>(() => document.createElement('div'), Scope.Game)

PostInitEvent.subscribe(() =>
    Y<Element, void>((rec) => (displayObject) => {
        Array.from(displayObject.children).forEach(rec)
        if (displayObject instanceof HTMLImageElement) {
            displayObject.src = displayObject.getAttribute('meta')!
        }
    })(stageView())
)

// 跨幕环境变量file,需要收集副作用
export type SetImageCommandArgs = {
    name: string
    file: string
    ease?: string
    duration?: number
} & Record<string, string>

// z,w,h可选,若不设定则默认在最上层,保持图片原宽高
export const setImage = Dynamic<SetImageCommandArgs>(
    (context) =>
        function* ({ name, file, ease, duration = 0, ...args }) {
            const { state } = context
            const stage = stageView()
            const array = stage.getElementsByClassName(name)
            const oldBitmap = array[0] as HTMLImageElement | null
            const newBitmap = (oldBitmap?.cloneNode() || <img class={name} />) as HTMLImageElement
            const attr = context.state === GameState.Init ? 'meta' : 'src'
            newBitmap.setAttribute(attr, file)
            Object.assign(newBitmap.style, args)
            stage.insertBefore(newBitmap, stage.firstChild)
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
} & Record<string, string>

export const tweenImage = Dynamic<TweenImageCommandArgs>(
    () =>
        function* ({ target, ease, duration = 0, ...args }) {
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
