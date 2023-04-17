import { DrawerDirection, DrawerId } from '../enums'

export interface IDrawerState {
    active: boolean
    id: DrawerId
    hideClose?: boolean
    preventClose?: boolean
    direction?: DrawerDirection
    overflow?: boolean
}
