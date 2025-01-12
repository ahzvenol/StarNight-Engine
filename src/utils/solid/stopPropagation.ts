export function stopPropagation<E extends Event>(event: E): void
export function stopPropagation<E extends Event>(fn?: Function1<E, void>): Function1<E, void>
export function stopPropagation<E extends Event>(e: Function1<E, void> | Event | undefined): Function1<E, void> | void {
    if (typeof e === 'function')
        return (event: E) => {
            event.stopPropagation()
            e?.(event)
        }
    else e!.stopPropagation()
}
