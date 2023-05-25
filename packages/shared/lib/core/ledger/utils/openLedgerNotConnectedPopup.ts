import { get } from 'svelte/store'
import { openOverlay, PopupId, popupState } from '@overlay'

export function openLedgerNotConnectedPopup(
    cancel: () => void = () => {},
    poll: () => void = () => {},
    overridePopup: boolean = false
): void {
    if (!get(popupState).active || overridePopup) {
        openOverlay({
            id: PopupId.ConnectLedger,
            props: {
                onClose: () => cancel(),
                onPoll: () => poll(),
            },
        })
    }
}
