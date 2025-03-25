/* eslint-disable @typescript-eslint/no-explicit-any */

export function isGenerator(value: unknown): value is Generator {
    return (value && typeof (value as any).next === 'function' && typeof (value as any).throw === 'function') as boolean
}
