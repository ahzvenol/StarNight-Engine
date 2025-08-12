type EventListener<T> = (payload: T) => void

export class EventDispatcher<T> {
    public static on =
        <T>(event: EventDispatcher<T>) =>
            () =>
                new Promise<T>(event.once)

    private listeners: Set<EventListener<T>> = new Set()

    public publish = (payload: T): void => {
        for (const fn of this.listeners) {
            try {
                fn(payload)
            } catch (e) {
                console.error(e)
            }
        }
    }

    public subscribe = (listener: EventListener<T>): void => {
        this.listeners.add(listener)
    }

    public unsubscribe = (listener?: EventListener<T>): void => {
        if (listener) {
            this.listeners.delete(listener)
        } else {
            this.listeners.clear()
        }
    }

    public once = (listener: EventListener<T>): void => {
        const wrapper = (event: T) => {
            this.unsubscribe(wrapper)
            listener(event)
        }
        this.subscribe(wrapper)
    }
}
