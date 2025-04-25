export function stopPropagation<K extends keyof DocumentEventMap>(...args: K[]): Function1<EventTarget, void> {
    return (ref) => args.forEach((type) => addEventListener(type, (event) => event.stopPropagation()), { target: ref })
}
