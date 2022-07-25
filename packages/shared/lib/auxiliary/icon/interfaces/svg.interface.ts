import { ISvgPath } from './svg-path.interface'

/**
 * The interface to define an SVG icon.
 */
export interface ISvg {
    width?: number
    height?: number
    path: ISvgPath[]
}
