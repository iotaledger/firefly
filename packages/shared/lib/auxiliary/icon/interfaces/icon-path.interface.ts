/**
 * The interface to define the SVG icon path.
 */
export interface IIconPath {
    d: string
    fillRule?: 'nonzero' | 'evenodd'
    clipRule?: 'nonzero' | 'evenodd' | 'inherit'
    strokeWidth?: string | number
    strokeLinecap?: 'butt' | 'round' | 'square'
    strokeColor?: string
    fill?: string
    opacity?: string | number
}
