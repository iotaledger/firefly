import { get } from 'svelte/store'
import { openPopup, popupState } from '@auxiliary/popup'

export function openLedgerNotConnectedPopup(
    cancel: () => void = () => {},
    poll: () => void = () => {},
    overridePopup: boolean = false
): void {
    if (!get(popupState).active || overridePopup) {
        openPopup({
            type: 'connectLedger',
            props: {
                onClose: () => cancel(),
                onPoll: () => poll(),
            },
        })
    }
}
