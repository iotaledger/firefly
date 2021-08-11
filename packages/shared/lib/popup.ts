import { get, writable } from 'svelte/store'
import { showAppNotification } from './notifications'
import { localize } from './i18n'

interface PopupState {
    active: boolean
    type: string
    hideClose?: boolean
    preventClose?: boolean
    fullScreen?: boolean
    transition?: boolean
    props?: any
}

export const popupState = writable<PopupState>({
    active: false,
    type: null,
    hideClose: false,
    preventClose: false,
    fullScreen: false,
    transition: undefined,
    props: null
})

export const openPopup = ({ type, props = null, hideClose = false, preventClose = false, fullScreen = false, transition = undefined }) => {
    modifyPopupState({ active: true, type, hideClose, preventClose, fullScreen, transition, props })
}

export const closePopup = (forceClose: boolean = false) => {
    modifyPopupState({ active: false, type: null, hideClose: false, preventClose: false, fullScreen: false, props: null }, forceClose)
}

const modifyPopupState = (state: PopupState, forceClose: boolean = false) => {
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
            message: localize('error.popup.preventClose')
        })
    }
    else {
        popupState.set({ ...state })
    }
}
