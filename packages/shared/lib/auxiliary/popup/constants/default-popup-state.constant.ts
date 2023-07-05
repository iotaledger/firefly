import { IPopupState } from '../interfaces'

export const DEFAULT_POPUP_STATE: IPopupState = {
    active: false,
    id: undefined,
    hideClose: false,
    preventClose: false,
    fullScreen: false,
    transition: undefined,
    props: null,
    overflow: false,
    relative: true,
}
