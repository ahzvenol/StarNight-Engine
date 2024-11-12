import type { CommandArg, DynamicCommand, NonBlockingCommand } from '../../type'
import { isNotNil, mapValues } from 'es-toolkit'
import { match } from 'ts-pattern'
import { PostInitEvent } from '@/core/event'
import { State } from '@/core/type'
import { Scope, useAutoResetSignal } from '@/core/useScopeSignal'
import { Y } from '@/utils/FPUtil'
import { tween } from './tween'

// 跨幕环境变量file,需要收集副作用
export type SetImageCommandArgs = {
    name: string
    file: string
    ease?: string
    duration: number
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
export const setImage: DynamicCommand<SetImageCommandArgs> = (context) =>
    function* ({ name, file, ease, duration, x = 0, y = 0, z = 1, w, h }) {
        const { state } = context
        const stage = stageView()
        const array = stage.getElementsByClassName(name)
        const bitmap = match(state)
            // @ts-expect-error 类型与属性识别异常
            .with(State.Init, () => <img attr:meta={file} />)
            .otherwise(() => <img src={file} />) as HTMLImageElement
        bitmap.className = name
        bitmap.style.translate = `${x}px ${y}px`
        bitmap.style.zIndex = `${z}`
        if (w !== undefined) bitmap.style.width = `${w}px`
        if (h !== undefined) bitmap.style.height = `${h}px`
        const oldBitmap = array[0]
        stage.insertBefore(bitmap, stage.firstChild)
        if (isNotNil(oldBitmap)) {
            if (state !== State.Init) {
                const sequence = tween({ target: oldBitmap, ease, duration })({ opacity: 0 })
                yield sequence.finished
            }
            oldBitmap.parentNode?.removeChild(oldBitmap)
        }
    }

export type TweenImageCommandArgs = {
    target: string
    ease?: string
    duration: number
} & Record<string, CommandArg>

export const tweenImage: DynamicCommand<TweenImageCommandArgs> = () =>
    function* ({ target, ease, duration, ...args }) {
        if (args.x !== undefined) {
            args.translateX = args.x
            delete args.x
        }
        if (args.y !== undefined) {
            args.translateY = args.y
            delete args.y
        }

        const tweenTarget = stageView().getElementsByClassName(target)[0]
        const sequence = tween({ target: tweenTarget, ease, duration })(mapValues(args, (arg) => '+=' + arg))
        yield sequence.finished
        sequence.seek(sequence.duration)
    }

export type RemoveImageCommandArgs = XOR<{ target: string }, { exclude: string }>

export const removeImage: NonBlockingCommand<RemoveImageCommandArgs> =
    () =>
    ({ target, exclude }) => {
        if (target) {
            stageView().removeChild(stageView().getElementsByClassName(target)[0])
        } else {
            Array.from(stageView().children).forEach((e) => {
                if (e.className !== exclude) stageView().removeChild(e)
            })
        }
    }
