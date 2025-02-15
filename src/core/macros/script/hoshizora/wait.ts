import type { MacroFunction } from '@/core/types/Marco'

export const wait: MacroFunction<{ duration: number }> = ({ duration }) => {
    return [
        {
            key: 'await',
            args: [
                {
                    key: 'fork',
                    args: [
                        { key: 'click', args: { enable: false } },
                        { key: 'textbox', args: { enable: false } },
                        { key: 'wait', args: { duration: duration } },
                        { key: 'textbox', args: { enable: true } },
                        { key: 'click', args: { enable: true } }
                    ]
                }
            ]
        }
    ]
}
