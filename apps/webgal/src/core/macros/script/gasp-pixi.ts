import type { MacroFunction } from '@starnight/core'
import type { SetImageCommandArgs, TweenImageCommandArgs } from '../../commands/script/gasp-pixi'
import { mapValues, omit } from 'es-toolkit'
import { renameKeys } from '@/utils/renameKeys'

export type SetBGMacroArgs = {
    duration?: number
    x?: number
    y?: number
}

// 由于设置了新图片之后就获取不到旧图片,需要先对旧图片施加变换,但是这样一来透明度就变了,所以需要重新指定透明度

export const sprite: MacroFunction<SetImageCommandArgs & SetBGMacroArgs & { z?: number }> = (args) => {
    args.src = `./static/ImageAsset/${args.src}.webp`
    const renamedArgs = renameKeys(args, { z: 'zIndex' })
    const imageArgs = Object.assign({ alpha: 1 }, omit(renamedArgs, ['duration']), { zIndex: 1 })
    const tweenArgs = { target: args.id, ease: 'power1.in', duration: 175, alpha: 0, inherit: false }
    return [
        { key: 'tweenimage', args: tweenArgs },
        { key: 'setimage', args: imageArgs as unknown as SetImageCommandArgs }
    ]
}

export const bg: MacroFunction<SetImageCommandArgs & SetBGMacroArgs> = (args) => {
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
    const renamedArgs = renameKeys(args, { z: 'zIndex' })
    const tweenArgs = { target: args.id, ease: 'power1.in', duration: args.duration, alpha: 0, inherit: false }
    const imageArgs = Object.assign({ alpha: 1 }, omit(renamedArgs, ['duration']), scale)
    return [
        { key: 'tweenimage', args: tweenArgs },
        { key: 'setimage', args: imageArgs as unknown as SetImageCommandArgs },
        { key: 'unlock', args: { target: raw } }
    ]
}

export const tweenimage: MacroFunction<TweenImageCommandArgs> = ({ target, ease, duration, ...args }) => {
    const renamedArgs = renameKeys(args, {})
    const offsetArgs = mapValues(renamedArgs as Record<string, number>, (arg) => '+=' + arg)
    return [
        {
            key: 'tweenimage',
            args: {
                target,
                ease,
                duration,
                ...offsetArgs
            } as unknown as TweenImageCommandArgs
        }
    ]
}
