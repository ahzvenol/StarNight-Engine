import type { CommandEntitys } from '@/core/types/Command'
import type { MacroFunction } from '@/core/types/Marco'
import type { SetImageCommandArgs } from '../script/image'

export const setImage: MacroFunction<SetImageCommandArgs> = (args) => {
    const array = Array<CommandEntitys>()
    const newArgs = {
        name: args.name,
        duration: args.duration,
        file: `./static/ImageAsset/${args.file}.png`,
        ease: 'easeInQuad'
    } as SetImageCommandArgs
    if (args.name !== 'BG') args.duration = 175
    if (args.x !== undefined && args.y !== undefined) newArgs.translate = `${args.x}px ${args.y}px`
    // fix:这两个属性会互相覆盖
    // if (x !== undefined) newBitmap.style.transform = `translateX(${x}px)`
    // if (y !== undefined) newBitmap.style.transform = `translateY(${y}px)`
    if (args.z !== undefined) newArgs.zIndex = `${args.z}`
    if (args.w !== undefined) newArgs.width = `${args.w}px`
    if (args.h !== undefined) newArgs.height = `${args.h}px`
    array.push({ key: 'image', args: newArgs })
    array.push({ key: 'unlock', args: { file: args.file } })
    return array
}
