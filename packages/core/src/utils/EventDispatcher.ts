type EventListener<T> = (payload: T) => void

export class EventDispatcher<T> {
    public static on =
        <T>(event: EventDispatcher<T>) =>
            () =>
                new Promise<T>(event.once)

    public all: Set<EventListener<T>> = new Set()

    public publish = (payload: T): void => {
        for (const fn of this.all) {
            try {
                fn(payload)
            } catch (e) {
                console.error(e)
            }
        }
    }

    public subscribe = (listener: EventListener<T>): void => {
        this.all.add(listener)
    }

    public unsubscribe = (listener?: EventListener<T>): void => {
        if (listener) {
            this.all.delete(listener)
        } else {
            this.all.clear()
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
