import { get } from 'svelte/store'
import { closePopup, popupState } from '@auxiliary/popup'
import { ledgerNanoStatus, updateLedgerNanoStatus } from '../stores'
import { getLedgerNanoStatus } from '@core/secret-manager'

export async function getLedgerDeviceStatus(
    onConnected = (): void => {},
    onDisconnected = (): void => {},
    onError = (): void => {}
): Promise<void> {
    try {
        const status = await getLedgerNanoStatus()
        updateLedgerNanoStatus(status)

        if (get(ledgerNanoStatus).connected) {
            const isLedgerNotConnectedPopupOpened = get(popupState).active && get(popupState).id === 'connectLedger'

            if (isLedgerNotConnectedPopupOpened) {
                closePopup()
            }

            onConnected()
        } else {
            onDisconnected()
        }
    } catch (err) {
        onError()
    }
}
