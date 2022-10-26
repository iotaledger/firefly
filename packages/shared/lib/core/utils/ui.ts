/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { Event } from '@lib/typings/events'

import { isRecentDate } from './date'
import { Element } from './interfaces'

export function bindEvents(element: Element, events: Event<unknown>[]): { destroy } {
    const listeners = Object.entries(events).map(([event, handler]) => {
        const listener = element.addEventListener(event, handler)

        return [event, listener]
    })

    return {
        destroy() {
            listeners.forEach(([event, listener]) => {
                element.removeEventListener(event as string, listener)
            })
        },
    }
}

export function debounce(callback: () => void, wait = 500): (...args: unknown[]) => void {
    let _timeout
    return (...args) => {
        /* eslint-disable @typescript-eslint/no-this-alias */
        const context = this
        clearTimeout(_timeout)
        _timeout = setTimeout(() => callback.apply(context, args), wait)
    }
}

/**
 * Dispatch event on click outside of node
 * source: https://svelte.dev/repl/0ace7a508bd843b798ae599940a91783?version=3.16.7
 */
export function clickOutside(node: any, options?: { includeScroll }): { destroy } {
    const handleClick: (event: MouseEvent) => void = (event) => {
        if (node && !node.contains(event.target) && !event.defaultPrevented) {
            node.dispatchEvent(new CustomEvent('clickOutside', node))
        }
    }

    const handleScroll: () => void = () => {
        node.dispatchEvent(new CustomEvent('clickOutside', node))
    }

    document.addEventListener('mousedown', handleClick, true)

    if (options?.includeScroll) {
        document.addEventListener('scroll', handleScroll, true)
    }

    return {
        destroy(): void {
            document.removeEventListener('click', handleClick, true)
            if (options?.includeScroll) {
                document.removeEventListener('scroll', handleScroll, true)
            }
        },
    }
}

/**
 * Returns a boolean indicating if color is bright using YIQ conversion
 * @param color The color to be tested (can be HEX or RGB)
 * @returns Boolean true if color is bright
 */
export function isBright(color: string): boolean {
    if (color) {
        const rgb =
            color.includes('#') && color.length >= 7
                ? color.match(/\w\w/g)?.map((x) => parseInt(x, 16))
                : color.match(/[0-9]+/g)?.map((c) => parseInt(c, 10))
        if (rgb) {
            const yiq = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000
            return yiq >= 186
        }
    }
}

/**
 * Returns warning text color for last Stronghold backup
 * @param lastBackupDate: Blue if less than a month. Orange if less than three months. Red if more.
 */
export function getBackupWarningColor(lastBackupDate: Date): string {
    if (!(lastBackupDate instanceof Date)) {
        return 'red'
    }
    const { lessThanAMonth, lessThanThreeMonths } = isRecentDate(lastBackupDate)

    return lessThanAMonth ? 'blue' : lessThanThreeMonths ? 'yellow' : 'orange'
}
