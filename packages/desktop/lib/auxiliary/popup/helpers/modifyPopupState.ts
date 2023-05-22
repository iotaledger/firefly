import { get } from 'svelte/store'

import { IPopupState } from '../interfaces'
import { popupState } from '../stores'

export function modifyPopupState(state: IPopupState, forceClose: boolean = false): void {
    /**
     * NOTE: There are some cases where a popup needs to stay open despite
     * trying to perhaps close it or open another one. This is accomplished
     * by the preventClose prop on the PopupState object, which if true
     * will not allow the popup to be closed. Remember that it will have to
     * be closed at some point though so we have the argument forceClose.
     */
    if (get(popupState).preventClose && !forceClose) {
        /* showAppNotification({
            type: 'error',
            message: localize('error.popup.preventClose'),
        }) */
    } else {
        popupState.set({ ...state })
    }
}
