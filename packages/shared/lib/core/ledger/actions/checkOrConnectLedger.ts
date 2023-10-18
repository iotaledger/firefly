import { openPopup, PopupId, popupState } from '@auxiliary/popup'
import { get } from 'svelte/store'
import { LedgerConnectionState } from '../interfaces'
import { ledgerConnectionState } from '../stores'
import { handleError } from '@core/error/handlers/handleError'
import { IError } from '@core/error'

export async function checkOrConnectLedger(
    callback: () => Promise<unknown> = async (): Promise<void> => {},
    reopenPopup?: boolean,
    cancelledCallback?: () => unknown
): Promise<unknown> {
    const previousPopup = get(popupState)

    function _callback(): Promise<unknown> | void {
        if (reopenPopup) {
            openPopup({ ...previousPopup, props: { ...previousPopup.props, _onMount: callback } })
        } else {
            return callback()
        }
    }

    try {
        const ledgerConnected = get(ledgerConnectionState) === LedgerConnectionState.CorrectAppOpen
        if (ledgerConnected) {
            return callback()
        } else {
            openPopup({
                id: PopupId.ConnectLedger,
                hideClose: true,
                props: {
                    onContinue: _callback,
                    onCancel: cancelledCallback,
                },
            })
        }
    } catch (err) {
        handleError(err as unknown as IError)
    }
}
