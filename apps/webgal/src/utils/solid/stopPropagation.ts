export function stopPropagation<E extends Event>(event: E): void
export function stopPropagation<E extends Event>(fn?: Function1<E, void>): Function1<E, void>
export function stopPropagation<E extends Event>(
    arg0: Function1<E, void> | Event | undefined
): Function1<E, void> | void {
    if (typeof arg0 === 'function')
        return (event: E) => {
            event.stopPropagation()
            arg0?.(event)
        }
    else arg0!.stopPropagation()
}
