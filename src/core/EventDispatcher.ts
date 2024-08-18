import { tryFn } from "@/util"

type EventHandler<T> = Function1<T, void>
class EventDispatcher<T> {
    private callbacks: Dictionary<EventHandler<T>> = {};

    public publish(e: T): void {
        Object.values(this.callbacks).forEach(fn => tryFn(() => fn(e)))
    }

    public subscribe(callback: EventHandler<T>): void {
        const uuid = Symbol()
        this.callbacks[uuid] = callback
    }

    public once(callback: EventHandler<T>): void {
        const uuid = Symbol()
        this.callbacks[uuid] = (e) => {
            delete this.callbacks[uuid]
            callback(e)
        }
    }
}
const on = <T>(event: EventDispatcher<T>) => () => new Promise<T>(event.once)

export { EventDispatcher, on }