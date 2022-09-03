import { BaseError } from '@core/error'
import { openPopup, popupState } from '@lib/popup'
import { get } from 'svelte/store'
import { LedgerConnectionState } from '../interfaces'
import { ledgerConnectionState } from '../stores'

export function checkLedgerConnection(
    callback: () => Promise<unknown> = async () => {},
    reopenPopup?: boolean
): Promise<unknown> {
    const previousPopup = get(popupState)
    function _callback(): Promise<unknown> {
        if (reopenPopup) {
            openPopup({ ...previousPopup, props: { ...previousPopup.props, _onMount: callback } })
        } else {
            return callback()
        }
    }
    try {
        const ledgerConnected = get(ledgerConnectionState) === LedgerConnectionState.CorrectAppOpen
        if (ledgerConnected) {
            return _callback()
        } else {
            openPopup({
                type: 'promptLedgerConnection',
                hideClose: true,
                props: {
                    onContinue: _callback,
                },
            })
        }
    } catch (err) {
        new BaseError({ message: err.error ?? err.message, logToConsole: true })
    }
}
