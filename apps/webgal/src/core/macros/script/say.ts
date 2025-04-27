import type { CommandEntities, MacroFunction } from '@starnight/core'

export type SayCommandArgs = { text: string; name?: string; clip?: string }

export const say: MacroFunction<SayCommandArgs> = ({ text, name, clip }) => {
    return [
        {
            key: 'fork',
            args: [
                clip !== undefined ? { key: 'audio', args: { type: 'Clip', src: clip } } : undefined,
                { key: 'textpreview', args: { text } },
                { key: 'namepreview', args: { text: name } },
                name !== undefined ? { key: 'name', args: { text: name } } : undefined,
                clip !== undefined
                    ? { key: 'backlog', args: { text, name, clip: `./static/AudioClip/${clip}.flac` } }
                    : { key: 'backlog', args: { text, name } },
                { key: 'text', await: true, args: { text } },
                { key: 'icon', args: {} }
            ].filter((row) => row !== undefined) as CommandEntities[]
        }
    ]
}
