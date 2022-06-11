import { TouchInterpolationConfig } from '@lib/typings/actions'
import { spring } from 'svelte/motion'

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

export function touchInterpolation(node: Element, options: TouchInterpolationConfig): void {
    const start = options.start ? options.start : 1
    const end = options.end ? options.end : 0
    const intensityScale = options.intensityScale ? options.intensityScale : 1
    const intensityThreshold = options.upDownThreshold ? options.upDownThreshold : 0.5
    const interpolationStore = options.spring ? options.spring : spring(start)

    let clientYBefore = 0
    let newScale = start

    if (options.active === undefined) {
        options.active = true
    }

    function handleTouchStart(evt) {
        clientYBefore = evt.touches[0].clientY
    }

    function handleTouchMove(evt) {
        if (options.active === false) {
            return
        }
        const { clientY } = evt.touches[0]
        const touchYDelta = clientY - clientYBefore
        newScale += touchYDelta * intensityScale * 0.01
        newScale = newScale > start ? start : newScale
        newScale = newScale < end ? end : newScale
        void interpolationStore.set(newScale)
        clientYBefore = clientY
    }

    function handleTouchEnd() {
        if (options.active === false) {
            return
        }
        if (newScale > intensityThreshold) {
            newScale = start
        } else {
            newScale = end
        }
        void interpolationStore.set(newScale)
    }

    node.addEventListener('touchstart', handleTouchStart)
    node.addEventListener('touchmove', handleTouchMove)
    node.addEventListener('touchend', handleTouchEnd)
}
