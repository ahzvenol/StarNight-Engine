import { Try } from '@/utils/fp/Try'

type EventHandler<T> = Function1<T, void>
class EventDispatcher<T> {
    private callbacks: Map<symbol, EventHandler<T>> = new Map()

    public publish = (e: T) => {
        this.callbacks.forEach((fn) => Try.apply(() => fn(e)))
    }
    public subscribe = (callback: EventHandler<T>) => {
        const uuid = Symbol()
        this.callbacks.set(uuid, callback)
        return uuid
    }

    public unsubscribe = (id: symbol) => {
        this.callbacks.delete(id)
    }

    public unsubscribeAll = () => {
        this.callbacks.clear()
    }

    public once = (callback: EventHandler<T>) => {
        const uuid = Symbol()
        this.callbacks.set(uuid, (e) => {
            this.callbacks.delete(uuid)
            callback(e)
        })
    }
}
const on =
    <T>(event: EventDispatcher<T>) =>
    () =>
        new Promise<T>(event.once)

export { EventDispatcher, on }
