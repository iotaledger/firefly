import { writable } from 'svelte/store'

interface PopupState {
    active: boolean
    type: string
    hideClose?: boolean
    fullScreen?: boolean
    transition?: boolean
    props?: any
}
export const popupState = writable<PopupState>({ active: false, type: null, hideClose: false, fullScreen: false, transition: undefined, props: null })
export const openPopup = ({ type, props = null, hideClose = false, fullScreen = false, transition = undefined }) => popupState.set({ active: true, type, hideClose, fullScreen, transition, props })
export const closePopup = () => popupState.set({ active: false, type: null, hideClose: false, fullScreen: false, props: null })
