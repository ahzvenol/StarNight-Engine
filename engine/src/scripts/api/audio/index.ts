import type { Except } from 'type-fest'
import type { StandardDynamicCommand } from '@starnight/core'
import { ActScope, NonBlockingMacro } from '@starnight/core'
import { isString } from 'es-toolkit'
import * as Base from './base'

export const volume = Base.volume as StandardDynamicCommand<Except<Base.AudioVolumeCommandArgs, 'target'> & { target: string }, void>

export type AudioBGMCommandArgs =
Except<Base.AudioSetCommandArgs, 'track' | 'target'> & { target?: string, duration?: number, loop?: false }

export const bgm = NonBlockingMacro<AudioBGMCommandArgs>(
    () =>
        function* ({ target = 'bgm', volume = 1, loop = true, duration, ...args }) {
            args.src = `./static${args.src}`
            yield Base.close({ target, duration })
            if (duration) {
                yield Base.set({ loop, target, volume: 0, ...args, track: 'bgm' })
                yield Base.volume({ target, volume, duration })
            } else {
                yield Base.set({ loop, target, volume, ...args, track: 'bgm' })
            }
        }
)

export type AudioSECommandArgs =
Except<Base.AudioSetCommandArgs, 'track' | 'target'> & { target?: string, duration?: number, loop?: true }

export const se = NonBlockingMacro<AudioSECommandArgs>(
    () =>
        function* ({ target: _target, volume = 1, loop = false, duration, ...args }) {
            args.src = `./static${args.src}`
            const target = _target ?? loop ? 'se' : Symbol()
            if (isString(target)) yield Base.close({ target, duration })
            if (duration) {
                yield Base.set({ loop, target, volume: 0, ...args, track: 'se' })
                yield Base.volume({ target, volume, duration })
            } else {
                yield Base.set({ loop, target, volume, ...args, track: 'se' })
            }
        }
)

export type AudioClipCommandArgs = Except<Base.AudioSetCommandArgs, 'track' | 'target' | 'loop'>

export const clip = ActScope(
    NonBlockingMacro<AudioClipCommandArgs>(
        () =>
            function* (args) {
                args.src = `./static${args.src}`
                yield Base.close({ target: 'clip' })
                yield Base.set({ ...args, track: 'clip', target: 'clip' })
            }
    )
)

export const close = Base.close as StandardDynamicCommand<Except<Base.AudioCloseCommandArgs, 'target'> & { target: string }, void>
