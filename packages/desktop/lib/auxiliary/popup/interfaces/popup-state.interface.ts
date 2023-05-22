import { PopupId } from '../enums'
import { PopupProps } from '../types'

export interface IPopupState {
    active: boolean
    id: PopupId
    hideClose?: boolean
    preventClose?: boolean
    fullScreen?: boolean
    transition?: boolean
    props?: PopupProps
    overflow?: boolean
    relative?: boolean
}
