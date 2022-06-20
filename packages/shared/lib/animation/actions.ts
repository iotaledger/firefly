import { TouchInterpolationConfig } from './types'
import { spring } from 'svelte/motion'

/**
 * Interpolates between the given start and end value through touch interaction with the bounded element.
 * Whether the touch movement is up or down, the value interpolates to either the start or end when the threshold is passed.
 */
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
