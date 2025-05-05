import type { SetImageCommandArgs, TweenImageCommandArgs } from '../command/gasp-pixi'
import { Macro } from '@starnight/core'
import { mapValues, omit } from 'es-toolkit'
import { GaspPixi, Var } from '..'

export type SetBGMacroArgs = {
    duration?: number
    x?: number
    y?: number
}

// 由于设置了新图片之后就获取不到旧图片,需要先对旧图片施加变换,但是这样一来透明度就变了,所以需要重新指定透明度

export const sprite = Macro<SetImageCommandArgs & SetBGMacroArgs>(
    () =>
        async function* (args) {
            args.src = `./static/ImageAsset/${args.src}.webp`
            args.zIndex = args.z
            delete args.z
            yield to({ target: args.id, ease: 'power1.in', duration: 175, alpha: 0, inherit: false })
            yield GaspPixi.set(
                Object.assign({ alpha: 1 }, omit(args, ['duration']), { zIndex: 1 }) as SetImageCommandArgs
            )
        }
)

export const bg = Macro<SetImageCommandArgs & SetBGMacroArgs>(
    () =>
        async function* (args) {
            args.id = 'BG'
            args.zIndex = 0
            const raw = args.src
            const scale =
                raw.includes('bg_white') || raw.includes('bg_black') || raw.includes('bg_red')
                    ? { scaleX: 2, scaleY: 2 }
                    : raw.includes('large') || raw.includes('evcg')
                      ? { scaleX: 1, scaleY: 1 }
                      : { scaleX: 1.021, scaleY: 1.021 }
            args.src = `./static/ImageAsset/${args.src}.webp`
            args.zIndex = args.z
            delete args.z
            yield to({ target: args.id, ease: 'power1.in', duration: args.duration, alpha: 0, inherit: false })
            yield GaspPixi.set(Object.assign({ alpha: 1 }, omit(args, ['duration']), scale) as SetImageCommandArgs)
            yield Var.unlock(raw)
        }
)

export const to = Macro<TweenImageCommandArgs>(
    () =>
        async function* ({ target, ease, duration, ...args }) {
            const offsetArgs = mapValues(args, (arg) => '+=' + arg)
            yield GaspPixi.to({ target, ease, duration, ...offsetArgs })
        }
)
