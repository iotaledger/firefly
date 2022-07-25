/**
 * The interface to define the SVG icon path.
 */
export interface ISvgPath {
    fillPriority?: 'primary' | 'secondary'
    d: string
    fillRule?: 'nonzero' | 'evenodd' | 'inherit'
    clipRule?: 'nonzero' | 'evenodd' | 'inherit'
    strokeWidth?: string | number
    strokeLinecap?: 'butt' | 'round' | 'square'
    strokeColor?: string
    fill?: string
    opacity?: string | number
}
