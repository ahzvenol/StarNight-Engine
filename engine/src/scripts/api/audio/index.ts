import type { Except } from 'type-fest'
import type { StandardDynamicCommand } from '@starnight/core'
import { ActScope, NonBlockingMacro } from '@starnight/core'
import { isString } from 'es-toolkit'
import * as Impl from './impl'

export const volume = Impl.volume as StandardDynamicCommand<Except<Impl.AudioVolumeCommandArgs, 'target'> & { target: string }, void>

export type AudioBGMCommandArgs =
Except<Impl.AudioSetCommandArgs, 'track' | 'target'> & { target?: string, duration?: number, loop?: false }

export const bgm = NonBlockingMacro<AudioBGMCommandArgs>(
    () =>
        function* ({ target = 'bgm', volume = 1, loop = true, duration, ...args }) {
            yield Impl.close({ target, duration })
            if (duration) {
                yield Impl.set({ loop, target, volume: 0, ...args, track: 'bgm' })
                yield Impl.volume({ target, volume, duration })
            } else {
                yield Impl.set({ loop, target, volume, ...args, track: 'bgm' })
            }
        }
)

export type AudioSECommandArgs =
Except<Impl.AudioSetCommandArgs, 'track' | 'target'> & { target?: string, duration?: number, loop?: true }

export const se = NonBlockingMacro<AudioSECommandArgs>(
    () =>
        function* ({ target: _target, volume = 1, loop = false, duration, ...args }) {
            const target = _target ?? loop ? 'se' : Symbol()
            if (isString(target)) yield Impl.close({ target, duration })
            if (duration) {
                yield Impl.set({ loop, target, volume: 0, ...args, track: 'se' })
                yield Impl.volume({ target, volume, duration })
            } else {
                yield Impl.set({ loop, target, volume, ...args, track: 'se' })
            }
        }
)

export type AudioClipCommandArgs = Except<Impl.AudioSetCommandArgs, 'track' | 'target' | 'loop'>

export const clip = ActScope(
    NonBlockingMacro<AudioClipCommandArgs>(
        () =>
            function* (args) {
                yield Impl.close({ target: 'clip' })
                yield Impl.set({ ...args, track: 'clip', target: 'clip' })
            }
    )
)

export const close = Impl.close as StandardDynamicCommand<Except<Impl.AudioCloseCommandArgs, 'target'> & { target: string }, void>
