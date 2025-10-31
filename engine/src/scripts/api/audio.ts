import type { Except } from 'type-fest'
import type { AudioSetCommandArgs } from '../base/audio'
import { ActScope, NonBlockingMacro } from '@starnight/core'
import { Audio } from '../base'

export const volume = Audio.volume

export type AudioBGMCommandArgs = Except<AudioSetCommandArgs, 'type' | 'target'> & { target?: string, duration?: number, loop?: false }

export const bgm = NonBlockingMacro<AudioBGMCommandArgs>(
    () =>
        function* (_args) {
            const args = { loop: true, ..._args, type: 'bgm', target: _args.target ?? 'bgm' } as const
            if (args.duration) {
                yield (yield Audio.volume({ target: args.target, volume: 0, duration: args.duration }))
                yield Audio.close({ target: args.target })
                yield Audio.set({ ...args, volume: 0 })
                yield Audio.volume({ target: args.target, volume: args.volume ?? 1, duration: args.duration })
            } else {
                yield Audio.close({ target: args.target })
                yield Audio.set(args)
            }
        }
)

export type AudioSECommandArgs = Except<AudioSetCommandArgs, 'type' | 'target'> & { target?: string, duration?: number, loop?: true }

export const se = NonBlockingMacro<AudioSECommandArgs>(
    () =>
        function* (_args) {
            const args = { ..._args, type: 'se', target: _args.target ?? 'se' } as const
            if (args.duration) {
                yield (yield Audio.volume({ target: args.target, volume: 0, duration: args.duration }))
                yield Audio.close({ target: args.target })
                yield Audio.set({ ...args, volume: 0 })
                yield Audio.volume({ target: args.target, volume: args.volume ?? 1, duration: args.duration })
            } else {
                yield Audio.close({ target: args.target })
                yield Audio.set(args)
            }
        }
)

export type AudioClipCommandArgs = Except<AudioSetCommandArgs, 'type' | 'target' | 'loop'>

export const clip = ActScope(
    NonBlockingMacro<AudioClipCommandArgs>(
        () =>
            function* (_args) {
                const args = { ..._args, type: 'clip', target: 'clip' } as const
                yield Audio.close({ target: args.target })
                yield Audio.set(args)
            }
    )
)

export const close = Audio.close
