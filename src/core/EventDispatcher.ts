function tryFn(fn: () => void) {
    try {
        fn()
    } catch (e) {
        console.error(e)
    }
}

type EventHandler<T> = Function1<T, void>
class EventDispatcher<T> {
    private callbacks: Record<symbol, EventHandler<T>> = {};

    public publish = (e: T) => {
        Reflect.ownKeys(this.callbacks).forEach(key => tryFn(() => this.callbacks[key as symbol](e)))
    }
    public subscribe = (callback: EventHandler<T>) => {
        const uuid = Symbol()
        this.callbacks[uuid] = callback
    }

    public once = (callback: EventHandler<T>) => {
        const uuid = Symbol()
        this.callbacks[uuid] = (e) => {
            delete this.callbacks[uuid]
            callback(e)
        }
    }

}
const on = <T>(event: EventDispatcher<T>) => () => new Promise<T>(event.once)

export { EventDispatcher, on }