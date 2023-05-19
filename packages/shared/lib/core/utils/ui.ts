import { isRecentDate, isValidDate } from './date'
import type { UiEventFunction } from './types'

import type { Action } from 'svelte/action'

/**
 * Debounce function to limit the rate at which a function can fire;
 * prevents repeated calls to callback until wait timeout finishes
 * @param callback The function to be debounced
 * @param wait The time in milliseconds to wait before calling the function
 * source: https://amitd.co/code/typescript/debounce
 */
export function debounce<T extends UiEventFunction>(callback: T, wait = 500): UiEventFunction {
    let timer: ReturnType<typeof setTimeout>
    return (...args: unknown[]) => {
        clearTimeout(timer)
        timer = setTimeout(() => callback(...args), wait)
    }
}

/**
 * Dispatch event on click outside of node
 * source: https://svelte.dev/repl/0ace7a508bd843b798ae599940a91783?version=3.16.7
 * source: https://github.com/vnphanquang/svelte-put/tree/main/packages/actions/clickoutside
 */
export const clickOutside: Action = function (node) {
    const onClick: (event: Event) => void = (event) => {
        if (node && !node.contains(event.target as Node) && !event.defaultPrevented) {
            node.dispatchEvent(new CustomEvent('clickOutside', { detail: event }))
        }
    }

    document.addEventListener('click', onClick, true)

    return {
        destroy(): void {
            document.removeEventListener('click', onClick, true)
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
        if (color.includes('#') && color.length === 4) {
            color = `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`
        }
        const rgb =
            color.includes('#') && color.length === 7
                ? color.match(/\w\w/g)?.map((x) => parseInt(x, 16))
                : color.match(/[0-9]+/g)?.map((c) => parseInt(c, 10))
        if (rgb) {
            const yiq = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000
            return yiq >= 186
        }
    }
    return false
}

/**
 * Returns warning text color for last Stronghold backup.
 *      Blue if less than a month.
 *      Yellow if between one and three months.
 *      Orange if three or more months.
 *      Red if never.
 * @param {Date} lastBackupDate
 */
export function getBackupWarningColor(lastBackupDate: Date | null): string {
    if (!isValidDate(lastBackupDate)) {
        return 'red'
    }
    const { lessThanAMonth, lessThanThreeMonths } = isRecentDate(lastBackupDate) ?? {
        lessThanAMonth: false,
        lessThanThreeMonths: false,
    }

    return lessThanAMonth ? 'blue' : lessThanThreeMonths ? 'yellow' : 'orange'
}

/**
 * Action function that can be used by Svelte
 * Dispatches slide events abstracted from touch events
 * @param node HTMLElement to attach events to
 */
export function slidable(node: HTMLElement, use: boolean = true): { destroy: () => void } {
    let x: number
    let y: number
    let init: number
    // Define arrays for calc velocity later
    const positionQueue = { x: [0, 0, 0], y: [0, 0, 0] }
    const timeQueue = [0, 0, 0]

    function handleTouchstart(event: TouchEvent): void {
        event.stopImmediatePropagation()
        event.stopPropagation()

        if (event.targetTouches.length === 1) {
            init = window.performance.now()
            x = event.touches[0].pageX
            y = event.touches[0].pageY
        }

        node.addEventListener('touchmove', handleTouchmove, { capture: true, passive: true })
        node.addEventListener('touchend', handleTouchend, { capture: true, passive: true })
    }

    function handleTouchmove(event: TouchEvent): void {
        positionQueue.x.push(event.touches[0].pageX)
        positionQueue.y.push(event.touches[0].pageY)
        timeQueue.push(window.performance.now())
        positionQueue.x.shift()
        positionQueue.y.shift()
        timeQueue.shift()
        const initX = positionQueue.x[0]
        const endX = positionQueue.x[positionQueue.x.length - 1]
        const initY = positionQueue.y[0]
        const endY = positionQueue.y[positionQueue.y.length - 1]
        const initTime = timeQueue[0]
        const endTime = timeQueue[timeQueue.length - 1]

        if (event.targetTouches.length === 1) {
            const sx = event.touches[0].pageX - x
            const sy = event.touches[0].pageY - y
            x = event.touches[0].pageX
            y = event.touches[0].pageY

            node.dispatchEvent(
                new CustomEvent('slideMove', {
                    detail: { x, y, sx, sy, initX, endX, initY, endY, initTime, endTime },
                })
            )
        }
    }

    function handleTouchend(): void {
        node.dispatchEvent(new CustomEvent('slideEnd'))

        const elapsed = window.performance.now()
        if (init >= elapsed - 300) {
            node.dispatchEvent(new CustomEvent('tap'))
        }

        node.removeEventListener('touchmove', handleTouchmove, { capture: true })
        node.removeEventListener('touchend', handleTouchend, { capture: true })
    }

    if (use) {
        node.addEventListener('touchstart', handleTouchstart, { capture: true, passive: true })
    }

    return {
        destroy(): void {
            node.removeEventListener('touchstart', handleTouchstart, { capture: true })
        },
    }
}
