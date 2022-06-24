import { IIconPath } from './icon-path.interface'

/**
 * The interface to define an SVG icon.
 */
export interface IIcon {
    width?: number
    height?: number
    path: IIconPath[]
}
