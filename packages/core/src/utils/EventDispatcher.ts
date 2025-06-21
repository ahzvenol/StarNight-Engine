type EventListener<T> = Function1<T, void>

export type Publisher<T> = { publish: (e: T) => void }

export class EventDispatcher<T> {
    public static on =
        <T>(event: EventDispatcher<T>) =>
            () =>
                new Promise<T>(event.once)

    private callbacks: Map<symbol, EventListener<T>> = new Map()

    public publish = (payload: T) => {
        this.callbacks.forEach((fn) => {
            try {
                fn(payload)
            } catch (e) {
                console.error(e)
            }
        })
    }

    public subscribe = (listener: EventListener<T>) => {
        const symbol = Symbol()
        this.callbacks.set(symbol, listener)
        return symbol
    }

    public unsubscribe = (id: symbol) => {
        this.callbacks.delete(id)
    }

    public unsubscribeAll = () => {
        this.callbacks.clear()
    }

    public once = (listener: EventListener<T>) => {
        const symbol = Symbol()
        this.callbacks.set(symbol, (payload) => {
            this.callbacks.delete(symbol)
            listener(payload)
        })
    }
}
