import { DrawerId } from '../enums'
import { DrawerProps } from '../types'

export interface IDrawer {
    id: DrawerId
    props?: DrawerProps
}
