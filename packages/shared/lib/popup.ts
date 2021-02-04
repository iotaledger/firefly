import { writable } from 'svelte/store'

interface PopupState {
    active: boolean;
    type: string;
    props?: any;
}
export const popupState = writable<PopupState>({ active: false, type: null })
export const openPopup = ({ type, props }) => popupState.set({ active: true, type, props })
export const closePopup = () => popupState.set({ active: false, type: null })