import type { UseEventListenerOptions } from './useEventListener'
import { useEventListener } from './useEventListener'

export function useKeyPress(key: string, listener: EventListener, options: UseEventListenerOptions = {}) {
    let pressed = false
    const moveKeyDownListener = useEventListener(
        'keydown',
        (event) => {
            if (event.code === key && !pressed) {
                pressed = true
                listener(event)
            }
        },
        options
    )
    const moveKeyUpListener = useEventListener(
        'keyup',
        (event) => {
            if (event.key === key) {
                pressed = false
            }
        },
        options
    )

    const move = () => {
        moveKeyDownListener()
        moveKeyUpListener()
    }

    return move
}
