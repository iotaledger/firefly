import { modifyPopupState } from '../helpers'
import { IPopupState } from '../interfaces'

export function openPopup(
    {
        id,
        props = null,
        hideClose = false,
        preventClose = false,
        fullScreen = false,
        transition = undefined,
        overflow = false,
        relative = true,
    }: Omit<IPopupState, 'active'>,
    forceClose: boolean = false
): void {
    modifyPopupState(
        { active: true, id: id, hideClose, preventClose, fullScreen, transition, props, overflow, relative },
        forceClose
    )
}
