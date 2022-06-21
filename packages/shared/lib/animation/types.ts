import type { Spring } from 'svelte/motion'

export type TouchInterpolationConfig = {
    spring?: Spring<number>
    upperBoundary?: number
    lowerBoundary?: number
    intensityScale?: number
    upDownThreshold?: number
    active?: boolean
}
