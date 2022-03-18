import { Event } from '@lib/typings/events'

interface IElement {
    addEventListener(event: Event<unknown> | string, unknown)
    removeEventListener(event: Event<unknown> | string, handler: unknown): void
}

interface IBoundElement {
    destroy(): void
}

/**
 * Returns a bound element that listens to specified events.
 */
export function bindEvents(element: IElement, events: Event<unknown>[]): IBoundElement {
    const listeners = Object.entries(events).map(([event, handler]) => {
        const listener = element.addEventListener(event, handler)

        return [event, listener]
    })

    return {
        destroy() {
            listeners.forEach(([event, listener]) => {
                element.removeEventListener(event, listener)
            })
        },
    }
}

/**
 * Returns a callback delayed by a specified duration (milliseconds).
 */
export function debounce(callback: () => void, wait = 500): (...args: unknown[]) => void {
    let _timeout
    return (...args) => {
        /* eslint-disable @typescript-eslint/no-this-alias */
        const context = this
        clearTimeout(_timeout)
        _timeout = setTimeout(() => callback.apply(context, args), wait)
    }
}
