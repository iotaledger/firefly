/**
 * The interface to define the SVG icon path.
 */
export interface ISvgPath {
    d: string
    fillRule?: 'nonzero' | 'evenodd'
    clipRule?: 'nonzero' | 'evenodd' | 'inherit'
    strokeWidth?: string | number
    strokeLinecap?: 'butt' | 'round' | 'square'
    strokeColor?: string
    fill?: string
    opacity?: string | number
}
