import { get } from 'svelte/store'
import { popupState, closePopup } from '@lib/popup'

export function handleLedgerErrors(error: string): void {
    const _popupState = get(popupState)

    // Transaction rejected by user on ledger device
    if (error.includes('denied')) {
        if (
            _popupState.active &&
            (_popupState.type === 'ledgerTransaction' || _popupState.type === 'enableLedgerBlindSigning')
        ) {
            // TODO: Probably a good idea to also display a notification here?
            closePopup()
        }
    }
}
