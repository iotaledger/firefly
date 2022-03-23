import { get } from 'svelte/store'

import { localize } from '@core/i18n'
import { showAppNotification } from '@core/notification'

import { popupState } from './stores'
import { PopupState } from './types'

export function openPopup(
    {
        type,
        props = null,
        hideClose = false,
        preventClose = false,
        fullScreen = false,
        transition = undefined,
    }: Omit<PopupState, 'active'>,
    forceClose: boolean = false
): void {
    modifyPopupState({ active: true, type, hideClose, preventClose, fullScreen, transition, props }, forceClose)
}

export function closePopup(forceClose: boolean = false): void {
    modifyPopupState(
        { active: false, type: null, hideClose: false, preventClose: false, fullScreen: false, props: null },
        forceClose
    )
}

function modifyPopupState(state: PopupState, forceClose: boolean = false): void {
    /**
     * NOTE: There are some cases where a popup needs to stay open despite
     * trying to perhaps close it or open another one. This is accomplished
     * by the preventClose prop on the PopupState object, which if true
     * will not allow the popup to be closed. Remember that it will have to
     * be closed at some point though so we have the argument forceClose.
     */
    if (get(popupState).preventClose && !forceClose) {
        showAppNotification({
            type: 'error',
            message: localize('error.popup.preventClose'),
        })
    } else {
        popupState.set({ ...state })
    }
}
