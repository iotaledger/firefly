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
 * Dispatch event on click outside of node
 * source: https://svelte.dev/repl/0ace7a508bd843b798ae599940a91783?version=3.16.7
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export function clickOutside(node: any, options?: { includeScroll }): { destroy } {
    const handleClick = (event) => {
        if (node && !node.contains(event.target) && !event.defaultPrevented) {
            node.dispatchEvent(new CustomEvent('clickOutside', node))
        }
    }

    const handleScroll = (event) => {
        node.dispatchEvent(new CustomEvent('clickOutside', node))
    }

    document.addEventListener('click', handleClick, true)

    if (options?.includeScroll) {
        document.addEventListener('scroll', handleScroll, true)
    }

    return {
        destroy() {
            document.removeEventListener('click', handleClick, true)
            if (options?.includeScroll) {
                document.removeEventListener('scroll', handleScroll, true)
            }
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
