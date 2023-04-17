import { DEFAULT_DRAWER_STATE } from '../constants'
import { drawerState } from '../stores'

export function closeDrawer(): void {
    drawerState.set(DEFAULT_DRAWER_STATE)
}
