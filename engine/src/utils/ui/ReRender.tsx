import type { JSX } from 'solid-js'
import { createMemo, on } from 'solid-js'

export function ReRender(props: { key: unknown, children: JSX.Element }): JSX.Element {
    return createMemo(on(() => props.key, () => props.children)) as unknown as JSX.Element
}
