import { get } from 'svelte/store'
import { openPopup, PopupId, popupState } from '../../../../../desktop/lib/auxiliary/popup'

export function openLedgerNotConnectedPopup(
    cancel: () => void = () => {},
    poll: () => void = () => {},
    overridePopup: boolean = false
): void {
    if (!get(popupState).active || overridePopup) {
        openPopup({
            id: PopupId.ConnectLedger,
            props: {
                onClose: () => cancel(),
                onPoll: () => poll(),
            },
        })
    }
}
