export function suppress<K extends keyof DocumentEventMap>(...args: K[]): Function1<EventTarget, void> {
    return (ref) => args.forEach((type) =>
        ref.addEventListener(type, (event) => (event.preventDefault(), event.stopPropagation()))
    )
}
