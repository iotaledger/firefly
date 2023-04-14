import { DEFAULT_SIDE_DRAWER_STATE } from '../constants'
import { sideDrawerState } from '../stores'

export function closeSideDrawer(): void {
    sideDrawerState.set(DEFAULT_SIDE_DRAWER_STATE)
}
