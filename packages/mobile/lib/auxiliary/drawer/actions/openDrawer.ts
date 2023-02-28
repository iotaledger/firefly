import { DrawerId } from '../enums'
import { addDrawerState } from '../stores'
import { DrawerProps } from '../types'

export function openDrawer(drawerId: DrawerId, props?: DrawerProps): void {
    addDrawerState({ id: drawerId, props })
}
