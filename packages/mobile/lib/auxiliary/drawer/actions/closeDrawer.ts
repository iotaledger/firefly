import { DrawerId } from '../enums'
import { removeDrawerState } from '../stores'

export function closeDrawer(drawerId: DrawerId): void {
    removeDrawerState(drawerId)
}
