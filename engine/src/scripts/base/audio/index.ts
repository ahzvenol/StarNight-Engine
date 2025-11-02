import type { Except } from 'type-fest'
import { ActScope, NonBlockingMacro } from '@starnight/core'
import * as Impl from './impl'

export const volume = Impl.volume

export type AudioBGMCommandArgs =
Except<Impl.AudioSetCommandArgs, 'type' | 'target'> & { target?: string, duration?: number, loop?: false }

export const bgm = NonBlockingMacro<AudioBGMCommandArgs>(
    () =>
        function* (_args) {
            const args = { loop: true, ..._args, type: 'bgm', target: _args.target ?? 'bgm' } as const
            if (args.duration) {
                yield (yield Impl.volume({ target: args.target, volume: 0, duration: args.duration }))
                yield Impl.close({ target: args.target })
                yield Impl.set({ ...args, volume: 0 })
                yield Impl.volume({ target: args.target, volume: args.volume ?? 1, duration: args.duration })
            } else {
                yield Impl.close({ target: args.target })
                yield Impl.set(args)
            }
        }
)

export type AudioSECommandArgs =
Except<Impl.AudioSetCommandArgs, 'type' | 'target'> & { target?: string, duration?: number, loop?: true }

export const se = NonBlockingMacro<AudioSECommandArgs>(
    () =>
        function* (_args) {
            const args = { ..._args, type: 'se', target: _args.target ?? 'se' } as const
            if (args.duration) {
                yield (yield Impl.volume({ target: args.target, volume: 0, duration: args.duration }))
                yield Impl.close({ target: args.target })
                yield Impl.set({ ...args, volume: 0 })
                yield Impl.volume({ target: args.target, volume: args.volume ?? 1, duration: args.duration })
            } else {
                yield Impl.close({ target: args.target })
                yield Impl.set(args)
            }
        }
)

export type AudioClipCommandArgs = Except<Impl.AudioSetCommandArgs, 'type' | 'target' | 'loop'>

export const clip = ActScope(
    NonBlockingMacro<AudioClipCommandArgs>(
        () =>
            function* (_args) {
                const args = { ..._args, type: 'clip', target: 'clip' } as const
                yield Impl.close({ target: args.target })
                yield Impl.set(args)
            }
    )
)

export const close = Impl.close
