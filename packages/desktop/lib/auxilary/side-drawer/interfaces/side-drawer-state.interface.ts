import { SideDrawerDirection, SideDrawerType } from '../enums'

export interface ISideDrawerState {
    active: boolean
    type: SideDrawerType
    hideClose?: boolean
    preventClose?: boolean
    direction?: SideDrawerDirection
    overflow?: boolean
}
