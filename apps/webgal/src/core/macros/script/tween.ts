import type { MacroFunction } from '@starnight/core'
import type { TweenImageCommandArgs } from '@/core/commands/script/gasp-pixi'
import { mapValues } from 'es-toolkit'
import { renameKeys } from '@/utils/renameKeys'

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
