import { modifyPopupState } from '../helpers'

export function closePopup(forceClose: boolean = false): void {
    modifyPopupState(
        {
            active: false,
            type: null,
            hideClose: false,
            preventClose: false,
            fullScreen: false,
            props: null,
            overflow: false,
            relative: false,
        },
        forceClose
    )
}
