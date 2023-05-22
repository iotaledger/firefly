import { DrawerDirection } from '../enums'
import { IDrawerState } from '../interfaces'
import { drawerState } from '../stores'

export function openDrawer({
    id,
    direction = DrawerDirection.Right,
    hideClose = false,
    preventClose = false,
    overflow = false,
}: Omit<IDrawerState, 'active'>): void {
    drawerState.set({ active: true, id, hideClose, preventClose, direction, overflow })
}
