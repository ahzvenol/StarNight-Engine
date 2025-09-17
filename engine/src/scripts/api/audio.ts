import type { Except } from 'type-fest'
import type { AudioSetCommandArgs } from '../base/audio'
import { ActScope, DynamicMacro, NonBlockingMacro } from '@starnight/core'
import { Audio } from '../base'

export const volume = Audio.volume

export type AudioBGMCommandArgs = Except<AudioSetCommandArgs, 'type'> & { duration?: number, loop?: false }

export const bgm = NonBlockingMacro<AudioBGMCommandArgs>(
    () =>
        function* (_args) {
            const args = { loop: true, ..._args, type: 'bgm', id: _args.id || 'bgm' } as const
            if (args.duration) {
                yield (yield Audio.volume({ target: args.id, volume: 0, duration: args.duration }))
                yield Audio.close({ target: args.id })
                yield Audio.set({ ...args, volume: 0 })
                yield Audio.volume({ target: args.id, volume: args.volume || 1, duration: args.duration })
            } else {
                yield Audio.close({ target: args.id })
                yield Audio.set(args)
            }
        }
)

export type AudioSECommandArgs = Except<AudioSetCommandArgs, 'type'> & { duration?: number, loop?: true }

export const se = NonBlockingMacro<AudioSECommandArgs>(
    () =>
        function* (_args) {
            const args = { ..._args, type: 'se', id: _args.id || 'se' } as const
            if (args.duration) {
                yield (yield Audio.volume({ target: args.id, volume: 0, duration: args.duration }))
                yield Audio.close({ target: args.id })
                yield Audio.set({ ...args, volume: 0 })
                yield Audio.volume({ target: args.id, volume: args.volume || 1, duration: args.duration })
            } else {
                yield Audio.close({ target: args.id })
                yield Audio.set(args)
            }
        }
)

export type AudioClipCommandArgs = Except<AudioSetCommandArgs, 'type' | 'id' | 'loop'>

export const clip = ActScope(
    NonBlockingMacro<AudioClipCommandArgs>(
        () =>
            function* (_args) {
                const args = { ..._args, type: 'clip', id: 'clip' } as const
                yield Audio.close({ target: args.id })
                yield Audio.set(args)
            }
    )
)

export const close = DynamicMacro<{ target: string, duration?: number }>(
    () =>
        function* (args) {
            yield (yield Audio.volume({ volume: 0, ...args }))
            yield Audio.close({ target: args.target })
        }
)
