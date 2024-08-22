import { tryFn } from "@/utils"

type EventHandler<T> = Function1<T, void>
class EventDispatcher<T> {
    private callbacks: Record<symbol, EventHandler<T>> = {};

    public publish(e: T): void {
        // @ts-ignore
        Reflect.ownKeys(this.callbacks).forEach(key => tryFn(() => this.callbacks[key](e)))
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