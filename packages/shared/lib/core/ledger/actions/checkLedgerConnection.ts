import { BaseError } from '@core/error'
import { openPopup } from '@lib/popup'
import { get } from 'svelte/store'
import { LedgerConnectionState } from '../interfaces'
import { ledgerConnectionState } from '../stores'

export function checkLedgerConnection(callback: () => Promise<unknown> = async () => {}): Promise<unknown> {
    try {
        const ledgerConnected = get(ledgerConnectionState) === LedgerConnectionState.CorrectAppOpen
        if (ledgerConnected) {
            return callback()
        } else {
            openPopup({
                type: 'promptLedgerConnection',
                hideClose: true,
                props: {},
            })
        }
    } catch (err) {
        new BaseError({ message: err.error ?? err.message, logToConsole: true })
    }
}
