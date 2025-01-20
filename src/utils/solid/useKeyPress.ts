import type { UseEventListenerOptions } from './useEventListener'
import { useEventListener } from './useEventListener'

export function useKeyPress(key: string, listener: EventListener, options: UseEventListenerOptions = {}) {
    let pressed = false
    const removeKeyDownListener = useEventListener(
        'keydown',
        (event) => {
            if (event.code === key && !pressed) {
                pressed = true
                listener(event)
            }
        },
        options
    )
    const removeKeyUpListener = useEventListener(
        'keyup',
        (event) => {
            if (event.code === key) {
                pressed = false
            }
        },
        options
    )

    const remove = () => {
        removeKeyDownListener()
        removeKeyUpListener()
    }

    return remove
}
