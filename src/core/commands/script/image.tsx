import type { CommandArg, CommandLifeCycleFunction, CommandRunFunction } from '@/core/type'
import { isNotNil } from 'es-toolkit'
import { match } from 'ts-pattern'
import { State } from '@/core/type'
import { Y } from '@/utils/FPUtil'
import { useSignal } from '@/utils/Reactive'
import { Tween } from './tween'

// 跨幕环境变量file,需要收集副作用
type SetImageCommandArgs = {
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

export const stageView = useSignal<HTMLDivElement | null>(null)

const beforeInit: CommandLifeCycleFunction = () => stageView(document.createElement('div'))

const afterInit: CommandLifeCycleFunction = () =>
    Y<Element, void>((rec) => (displayObject) => {
        Array.from(displayObject.children).forEach(rec)
        if (displayObject instanceof HTMLImageElement) {
            displayObject.src = displayObject.getAttribute('meta')!
        }
    })(stageView()!)

// z,w,h可选,若不设定则默认在最上层,保持图片原宽高
const setImage: CommandRunFunction<SetImageCommandArgs> =
    (context) =>
    ({ name, file, ease, duration, x = 0, y = 0, z = 1, w, h }) => {
        console.log(stageView())

        const { state } = context
        // tag:unlock cg
        const array = stageView()!.getElementsByClassName(name)
        const bitmap = match(state)
            // @ts-expect-error 类型与属性识别异常
            .with(State.Init, () => <img attr:meta={file} />)
            .otherwise(() => <img src={file} />) as HTMLImageElement
        bitmap.className = name
        bitmap.style.left = `${x}px`
        bitmap.style.top = `${y}px`
        bitmap.style.zIndex = `${z}`
        if (w !== undefined) bitmap.style.width = `${w}px`
        if (h !== undefined) bitmap.style.height = `${h}px`
        const oldBitmap = array[0]
        if (isNotNil(oldBitmap)) {
            Tween(context)({ target: oldBitmap, ease, duration })({ opacity: 0 }).then(() => {
                stageView()!.removeChild(oldBitmap)
            })
        }
        stageView()!.insertBefore(bitmap, stageView()!.firstChild)
    }

export const SetImage = setImage

export const SetImageHooks = { beforeInit, afterInit }

type TweenImageCommandArgs = {
    target: string
    ease?: string
    duration: number
} & Record<string, CommandArg>

const tweenImage: CommandRunFunction<TweenImageCommandArgs> =
    (context) =>
    ({ target, ease, duration, ...args }) => {
        if (args.x !== undefined) {
            args.translateX = args.x
            delete args.x
        }
        if (args.y !== undefined) {
            args.translateY = args.y
            delete args.y
        }
        const tweenTarget = stageView()!.getElementsByClassName(target)[0]
        Tween(context)({ target: tweenTarget, ease, duration })(args)
    }

export const TweenImage = tweenImage

type RemoveImageCommandArgs = XOR<{ target: string }, { exclude: string }>

const removeImage: CommandRunFunction<RemoveImageCommandArgs> =
    () =>
    ({ target, exclude }) => {
        if (target) {
            stageView()!.removeChild(stageView()!.getElementsByClassName(target)[0])
        } else {
            Array.from(stageView()!.children).forEach((e) => {
                if (e.className !== exclude) stageView()!.removeChild(e)
            })
        }
    }

export const RemoveImage = removeImage
