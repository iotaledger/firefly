import { BaseError } from '@core/error'
import { openPopup, popupState } from '@lib/popup'
import { get } from 'svelte/store'
import { LedgerConnectionState } from '../interfaces'
import { ledgerConnectionState } from '../stores'

export function checkLedgerConnection(
    callback: () => Promise<unknown> = async () => {},
    reopenPopup?: boolean
): Promise<unknown> {
    try {
        const ledgerConnected = get(ledgerConnectionState) === LedgerConnectionState.CorrectAppOpen
        if (ledgerConnected) {
            return callback()
        } else {
            const popup = get(popupState)
            openPopup({
                type: 'promptLedgerConnection',
                hideClose: true,
                props: {},
            })
            if (reopenPopup) {
                openPopup({ ...popup, props: { ...popup.props, _onMount: callback } })
            } else {
                return callback()
            }
        }
    } catch (err) {
        new BaseError({ message: err.error ?? err.message, logToConsole: true })
    }
}
