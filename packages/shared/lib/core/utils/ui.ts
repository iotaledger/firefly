import { BridgeEvent } from '@core/actor'

import { isRecentDate } from './time'

interface IElement {
    addEventListener(event: BridgeEvent<unknown> | string, unknown)
    removeEventListener(event: BridgeEvent<unknown> | string, handler: unknown): void
}

interface IBoundElement {
    destroy(): void
}

/**
 * Returns a bound element that listens to specified events.
 */
export function bindEvents(element: IElement, events: BridgeEvent<unknown>[]): IBoundElement {
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
 * Convert HEX color to RGBA
 * @param hexCode: hex color to convert
 * @param opacity: [0,100], default = 100
 */
export const convertHexToRGBA = (hexCode: string, opacity: number = 100): string => {
    let hex = hexCode.replace('#', '')

    if (hex.length === 3) {
        hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`
    }

    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)

    return `rgba(${r},${g},${b},${opacity / 100})`
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

/**
 * Returns warning text color for last Stronghold backup
 * @param lastBackupDate: Blue if less than a month. Orange if less than three months. Red if more.
 */
export const getBackupWarningColor = (lastBackupDate: Date): string => {
    if (!(lastBackupDate instanceof Date)) {
        return 'red'
    }
    const { lessThanAMonth, lessThanThreeMonths } = isRecentDate(lastBackupDate)

    return lessThanAMonth ? 'blue' : lessThanThreeMonths ? 'yellow' : 'orange'
}

/**
 * Returns a boolean indicating if color is bright using YIQ conversion
 * @param color The color to be tested (can be HEX or RGB)
 * @returns Boolean true if color is bright
 */
export const isBright = (color: string): boolean => {
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
