import type { MacroFunction } from '@starnight/core'
import type { SetImageCommandArgs } from '../../commands/script/image'
import { omit } from 'es-toolkit'
import { renameKeys } from '@/utils/renameKeys'

export type SetBGMacroArgs = {
    duration?: number
    x?: number
    y?: number
    w?: number
    h?: number
}

// 由于设置了新图片之后就获取不到旧图片,需要先对旧图片施加变换,但是这样一来透明度就变了,所以需要重新指定透明度

export const sprite: MacroFunction<SetImageCommandArgs & SetBGMacroArgs & { z?: number }> = (args) => {
    args.src = `./static/ImageAsset/${args.src}.webp`
    const renamedArgs = renameKeys(args, { x: 'translateX', y: 'translateY', z: 'zIndex', w: 'width', h: 'height' })
    const imageArgs = Object.assign({ opacity: 1 }, omit(renamedArgs, ['duration']), { zIndex: 1 })
    const tweenArgs = { target: args.id, ease: 'easeInQuad', duration: 175, opacity: 0, inherit: false }
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
    const renamedArgs = renameKeys(args, { x: 'translateX', y: 'translateY', z: 'zIndex', w: 'width', h: 'height' })
    const tweenArgs = { target: args.id, ease: 'easeInQuad', duration: args.duration, opacity: 0, inherit: false }
    const imageArgs = Object.assign({ opacity: 1 }, omit(renamedArgs, ['duration']), scale)
    return [
        { key: 'tweenimage', args: tweenArgs },
        { key: 'setimage', args: imageArgs as unknown as SetImageCommandArgs },
        { key: 'unlock', args: { target: raw } }
    ]
}
