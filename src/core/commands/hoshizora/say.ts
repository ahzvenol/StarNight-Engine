import type { CommandEntitys } from '@/core/types/Command'
import type { MacroFunction } from '@/core/types/Marco'

export type SayCommandArgs = { text: string; name?: string; file?: string }

export const say: MacroFunction<SayCommandArgs> = ({ text, name, file }) => {
    return [
        {
            key: 'fork',
            args: [
                file !== undefined ? { key: 'audio', args: { type: 'Clip', file } } : undefined,
                {
                    key: 'await',
                    args: [
                        { key: 'text', args: { text } },
                        { key: 'preview', args: { text } },
                        name !== undefined ? { key: 'name', args: { name } } : undefined,
                        file !== undefined
                            ? { key: 'backlog', args: { text, name, file: `./static/AudioClip/${file}.flac` } }
                            : { key: 'backlog', args: { text, name } }
                    ].filter((row) => row !== undefined) as CommandEntitys[]
                },
                {
                    key: 'icon',
                    args: {}
                }
            ].filter((row) => row !== undefined) as CommandEntitys[]
        }
    ]
}
