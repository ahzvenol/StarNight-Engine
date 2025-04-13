import { mapKeys } from 'es-toolkit'

export const renameKeys = <O extends Record<PropertyKey, unknown>, M extends Partial<Record<keyof O, PropertyKey>>>(
    object: O,
    keyMap: M
) =>
    mapKeys<O, keyof O | Extract<M[keyof M], PropertyKey>>(object, (_, key) => keyMap[key] || key) as Omit<
        O,
        keyof M
    > & {
        [K in Extract<M[keyof M], PropertyKey>]: O[keyof M]
    }
