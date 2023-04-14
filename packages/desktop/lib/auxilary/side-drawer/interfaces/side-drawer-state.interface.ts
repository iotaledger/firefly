import { SideDrawerDirection, SideDrawerId } from '../enums'

export interface ISideDrawerState {
    active: boolean
    id: SideDrawerId
    hideClose?: boolean
    preventClose?: boolean
    direction?: SideDrawerDirection
    overflow?: boolean
}
