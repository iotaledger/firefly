import { writable } from 'svelte/store'

interface PopupState {
    active: boolean
    type: string
    hideClose?: boolean
    fullScreen?: boolean
    props?: any
}
export const popupState = writable<PopupState>({ active: false, type: null, hideClose: false, fullScreen: false, props: null })
export const openPopup = ({ type, props = null, hideClose = false, fullScreen = false }) => popupState.set({ active: true, type, hideClose, fullScreen, props })
export const closePopup = () => popupState.set({ active: false, type: null, hideClose: false, fullScreen: false, props: null })
