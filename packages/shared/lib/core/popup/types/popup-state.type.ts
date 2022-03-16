/**
 * The type for the popup state, used when
 * trying to to open or close a popup.
 */
export type PopupState = {
    active: boolean
    type: string
    hideClose?: boolean
    preventClose?: boolean
    fullScreen?: boolean
    transition?: boolean
    props?: Record<string, unknown>
}
