import type { MacroFunction } from '@/core/types/Marco'
import type { TweenImageCommandArgs } from '../script/image'
import { mapValues } from 'es-toolkit'
import { renameKeys } from '@/utils/renameKeys'

export const tweenImage: MacroFunction<TweenImageCommandArgs> = ({ target, ease, duration, ...args }) => {
    const renamedArgs = renameKeys(args, { x: 'translateX', y: 'translateY' })
    const offsetArgs = mapValues(renamedArgs, (arg) => '+=' + arg)
    return [
        {
            key: 'tweenI',
            args: {
                target,
                ease,
                duration,
                ...offsetArgs
            } as unknown as TweenImageCommandArgs
        }
    ]
}
