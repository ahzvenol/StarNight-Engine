import { onCleanup } from 'solid-js'

export function useInterval(callback: () => void, delay?: number): () => void {
    let intervalId: number | undefined

    const clear = () => {
        if (intervalId !== undefined) {
            clearInterval(intervalId)
            intervalId = undefined
        }
    }

    intervalId = window.setInterval(callback, delay)

    onCleanup(clear)

    return clear
}
