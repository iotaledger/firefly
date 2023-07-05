import { writable } from 'svelte/store'

import { DEFAULT_POPUP_STATE } from '../constants'
import { IPopupState } from '../interfaces'
import { PopupProps } from '../types'

export const popupState = writable<IPopupState>(DEFAULT_POPUP_STATE)

export function updatePopupProps(payload: PopupProps): void {
    popupState?.update((state) => ({ ...state, props: { ...state?.props, ...payload } }))
}
