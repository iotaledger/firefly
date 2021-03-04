import { writable } from 'svelte/store'

interface PopupState {
    active: boolean
    type: string
    hideClose: boolean
    props?: any
}
export const popupState = writable<PopupState>({ active: false, type: null, hideClose: false, props: null })
export const openPopup = ({ type, props = null, hideClose = false }) => popupState.set({ active: true, hideClose, type, props })
export const closePopup = () => popupState.set({ active: false, type: null, hideClose: false, props: null })
