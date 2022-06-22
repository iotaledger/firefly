import { TouchInterpolationConfig } from './types'
import { spring } from 'svelte/motion'

/**
 * Interpolates between the upper and lower boundary through touch interaction with the given element.
 * Whether the touch movement is up or down, the value interpolates to either the upper or lower boundary when the threshold is passed.
 */
export function touchInterpolation(node: Element, options: TouchInterpolationConfig): void {
    const upperBoundary = options.upperBoundary ? options.upperBoundary : 1
    const lowerBoundary = options.lowerBoundary ? options.lowerBoundary : 0
    const intensityScale = options.intensityScale ? options.intensityScale : 1
    const intensityThreshold = options.upDownThreshold ? options.upDownThreshold : 0.5
    const interpolationStore = options.spring ? options.spring : spring(upperBoundary)

    let clientYBefore = 0
    let newScale = upperBoundary

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
        newScale = newScale > upperBoundary ? upperBoundary : newScale
        newScale = newScale < lowerBoundary ? lowerBoundary : newScale
        void interpolationStore.set(newScale)
        clientYBefore = clientY
    }

    function handleTouchEnd() {
        if (options.active === false) {
            return
        }
        if (newScale > intensityThreshold) {
            newScale = upperBoundary
        } else {
            newScale = lowerBoundary
        }
        void interpolationStore.set(newScale)
    }

    node.addEventListener('touchstart', handleTouchStart)
    node.addEventListener('touchmove', handleTouchMove)
    node.addEventListener('touchend', handleTouchEnd)
}
