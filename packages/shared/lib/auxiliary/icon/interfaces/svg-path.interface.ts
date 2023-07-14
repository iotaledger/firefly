import { FillPriority } from '../enums'

/**
 * The interface to define the SVG icon path.
 */
export interface ISvgPath {
    fillPriority?: FillPriority
    d: string
    fillRule?: 'nonzero' | 'evenodd' | 'inherit'
    clipRule?: 'nonzero' | 'evenodd' | 'inherit'
    strokeWidth?: string | number
    strokeLinecap?: 'butt' | 'round' | 'square'
    strokeColor?: string
    fill?: string
    opacity?: string | number
}
