import type { CommandEntities, MacroFunction } from '@starnight/core'

export type SayCommandArgs = { text: string; name?: string; file?: string }

export const say: MacroFunction<SayCommandArgs> = ({ text, name, file }) => {
    return [
        {
            key: 'fork',
            args: [
                file !== undefined ? { key: 'audio', args: { type: 'Clip', file } } : undefined,
                { key: 'textpreview', args: { text } },
                name !== undefined ? { key: 'name', args: { name } } : undefined,
                file !== undefined
                    ? { key: 'backlog', args: { text, name, file: `./static/AudioClip/${file}.flac` } }
                    : { key: 'backlog', args: { text, name } },
                { key: 'text', await: true, args: { text } },
                { key: 'icon', args: {} }
            ].filter((row) => row !== undefined) as CommandEntities[]
        }
    ]
}
