import type { MacroFunction } from '@/core/types/Marco'
import type { TweenImageCommandArgs } from '../script/image'
import { omit } from 'es-toolkit'

export const tweenImage: MacroFunction<TweenImageCommandArgs> = (args) => {
    return [
        {
            key: 'tween',
            args: {
                translateX: args.x,
                translateY: args.y,
                ...omit(args, ['x', 'y'])
            } as unknown as TweenImageCommandArgs
        }
    ]
}
