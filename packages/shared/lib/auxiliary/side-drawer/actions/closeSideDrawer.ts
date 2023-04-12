import { sideDrawerState } from '../stores'

export function closeSideDrawer(): void {
    sideDrawerState.set({
        active: false,
        type: null,
        hideClose: false,
        preventClose: false,
        direction: null,
        overflow: false,
    })
}
