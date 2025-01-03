import type { MacroFunction } from '@/core/types/Marco'

export type SayCommandArgs = { text: string; name?: string; file?: string }

export const say: MacroFunction<SayCommandArgs> = ({ text, name, file }) => {
    return [
        {
            key: 'await',
            args: [
                {
                    key: 'fork',
                    args: [
                        { key: 'text', args: { text } },
                        { key: 'preview', args: { text } },
                        name !== undefined ? { key: 'name', args: { name } } : undefined,
                        file !== undefined ? { key: 'audio', args: { type: 'Clip', file } } : undefined,
                        { key: 'backlog', args: { text, name, file } }
                    ].filter((row) => row !== undefined)
                },
                {
                    key: 'icon',
                    args: {}
                }
            ]
        }
    ]
}
