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

export function slidable(
    node: HTMLElement,
    options: { use?: boolean; preventSlide?: boolean } = { use: true, preventSlide: true }
): { destroy } {
    let x: number
    let y: number
    let init: number
    // Define arrays for calc velocity later
    const positionQueue = { x: [0, 0, 0], y: [0, 0, 0] }
    const timeQueue = [0, 0, 0]

    function handleTouchstart(event: TouchEvent): void {
        if (options?.preventSlide) {
            event.preventDefault()
            event.stopImmediatePropagation()
            event.stopPropagation()
        }

        if (event.targetTouches.length === 1) {
            init = window.performance.now()
            x = event.touches[0].pageX
            y = event.touches[0].pageY
        }

        node.addEventListener('touchmove', handleTouchmove, { capture: true, passive: true })
        node.addEventListener('touchend', handleTouchend, { capture: true, passive: true })
    }

    function handleTouchmove(event: TouchEvent) {
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
        const firstX = event.touches[0].pageX

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

    function handleTouchend() {
        node.dispatchEvent(new CustomEvent('slideEnd'))

        const elapsed = window.performance.now()
        if (init >= elapsed - 300) {
            node.dispatchEvent(new CustomEvent('tap'))
        }

        node.removeEventListener('touchmove', handleTouchmove, { capture: true })
        node.removeEventListener('touchend', handleTouchend, { capture: true })
    }

    node.addEventListener('touchstart', handleTouchstart, { capture: true, passive: true })

    return {
        destroy() {
            node.removeEventListener('touchstart', handleTouchstart, { capture: true })
        },
    }
}
