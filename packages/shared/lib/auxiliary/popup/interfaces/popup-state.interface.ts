import { PopupProps } from '../types'

export interface IPopupState {
    active: boolean
    type: string
    hideClose?: boolean
    preventClose?: boolean
    fullScreen?: boolean
    transition?: boolean
    props?: PopupProps
    overflow?: boolean
    relative?: boolean
}
