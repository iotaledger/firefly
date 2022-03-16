import { writable } from 'svelte/store'

import { PopupState } from '@core/popup'

export const popupState = writable<PopupState>({
    active: false,
    type: null,
    hideClose: false,
    preventClose: false,
    fullScreen: false,
    transition: undefined,
    props: null,
})
