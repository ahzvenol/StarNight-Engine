import { Try } from '@/utils/fp/Try'

type EventListener<T> = Function1<T, void>

export type Publisher<T> = { publish: (e: T) => void }

export class EventDispatcher<T> {
    private callbacks: Map<symbol, EventListener<T>> = new Map()

    public publish = (e: T) => {
        this.callbacks.forEach((fn) => Try.apply(() => fn(e)))
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
        this.callbacks.set(symbol, (e) => {
            this.callbacks.delete(symbol)
            listener(e)
        })
    }
}

export const on =
    <T>(event: EventDispatcher<T>) =>
    () =>
        new Promise<T>(event.once)
