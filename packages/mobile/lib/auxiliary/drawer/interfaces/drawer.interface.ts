import { DrawerId } from '../enums'
import { DrawerProps } from '../types'

export interface IDrawerState {
    id: DrawerId
    props?: DrawerProps
}
