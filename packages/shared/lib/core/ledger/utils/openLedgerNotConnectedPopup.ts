import { get } from 'svelte/store'
import { openPopup, popupState } from '@lib/popup'

export function openLedgerNotConnectedPopup(
    cancel: () => void = () => {},
    poll: () => void = () => {},
    overridePopup: boolean = false
): void {
    if (!get(popupState).active || overridePopup) {
        openPopup({
            type: 'ledgerNotConnected',
            hideClose: true,
            props: {
                handleClose: () => cancel(),
                poll,
            },
        })
    }
}
