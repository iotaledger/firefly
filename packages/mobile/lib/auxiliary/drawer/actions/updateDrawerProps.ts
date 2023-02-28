import { DrawerId } from '../enums'
import { updateDrawerState } from '../stores'
import { DrawerProps } from '../types'

export function updateDrawerProps(drawerId: DrawerId, props?: DrawerProps): void {
    updateDrawerState({ id: drawerId, props })
}
