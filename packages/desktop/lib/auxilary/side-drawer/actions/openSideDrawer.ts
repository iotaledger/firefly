import { SideDrawerDirection } from '../enums'
import { ISideDrawerState } from '../interfaces'
import { sideDrawerState } from '../stores'

export function openSideDrawer({
    id,
    direction = SideDrawerDirection.Right,
    hideClose = false,
    preventClose = false,
    overflow = false,
}: Omit<ISideDrawerState, 'active'>): void {
    sideDrawerState.set({ active: true, id, hideClose, preventClose, direction, overflow })
}
