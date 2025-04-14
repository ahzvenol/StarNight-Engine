import { onCleanup } from 'solid-js'

export type UseEventListenerOptions = {
    target?: EventTarget
    capture?: boolean
    passive?: boolean
}

export function useEventListener<K extends keyof DocumentEventMap>(
    type: K,
    listener: (event: DocumentEventMap[K]) => void,
    options?: UseEventListenerOptions
): () => void
export function useEventListener(type: string, listener: EventListener, options?: UseEventListenerOptions): () => void
export function useEventListener(type: string, listener: EventListener, options: UseEventListenerOptions = {}) {
    let attached: boolean | undefined

    const { target = window, passive = false, capture = false } = options

    if (target && !attached) {
        target.addEventListener(type, listener, { capture, passive })
        attached = true
    }

    const remove = () => {
        if (target && attached) {
            target.removeEventListener(type, listener, capture)
            attached = false
        }
    }

    onCleanup(remove)

    return remove
}
