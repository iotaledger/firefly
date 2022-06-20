import type { Spring } from 'svelte/motion'

export type TouchInterpolationConfig = {
    spring?: Spring<number>
    start?: number
    end?: number
    intensityScale?: number
    upDownThreshold?: number
    active?: boolean
}
