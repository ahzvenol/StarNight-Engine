import type { MacroFunction } from '@/core/types/Marco'
import type { SetImageCommandArgs } from '../../../commands/script/image'
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

export const setSprite: MacroFunction<SetImageCommandArgs & SetBGMacroArgs & { z?: number }> = (args) => {
    args.file = `./static/ImageAsset/${args.file}.webp`
    const renamedArgs = renameKeys(args, { x: 'translateX', y: 'translateY', z: 'zIndex', w: 'width', h: 'height' })
    const imageArgs = Object.assign({ opacity: 1 }, omit(renamedArgs, ['duration']), { zIndex: 1 })
    const tweenArgs = { target: args.name, ease: 'easeInQuad', duration: 175, opacity: 0 }
    return [
        { key: 'tweenI', args: tweenArgs },
        { key: 'setI', args: imageArgs as unknown as SetImageCommandArgs }
    ]
}

export const setBG: MacroFunction<SetImageCommandArgs & SetBGMacroArgs> = (args) => {
    args.name = 'BG'
    args.zIndex = 0
    const rawFile = args.file
    const scale =
        rawFile.includes('bg_white') || rawFile.includes('bg_black') || rawFile.includes('bg_red')
            ? { scaleX: 2, scaleY: 2 }
            : rawFile.includes('large') || rawFile.includes('evcg')
              ? { scaleX: 1, scaleY: 1 }
              : { scaleX: 1.021, scaleY: 1.021 }
    args.file = `./static/ImageAsset/${args.file}.webp`
    const renamedArgs = renameKeys(args, { x: 'translateX', y: 'translateY', z: 'zIndex', w: 'width', h: 'height' })
    const tweenArgs = { target: args.name, ease: 'easeInQuad', duration: args.duration, opacity: 0 }
    const imageArgs = Object.assign({ opacity: 1 }, omit(renamedArgs, ['duration']), scale)
    return [
        { key: 'tweenI', args: tweenArgs },
        { key: 'setI', args: imageArgs as unknown as SetImageCommandArgs },
        { key: 'unlock', args: { file: rawFile } }
    ]
}
