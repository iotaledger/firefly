import { get } from 'svelte/store'

import { getLedgerStatus } from '@lib/core/profile-manager/api'
import { closePopup, popupState } from '@lib/popup'

import { LedgerStatus } from '../interfaces'
import { ledgerDeviceStatus } from '../stores'
import { determineLedgerDeviceState } from '../utils'

export async function getLedgerDeviceStatus(
    onConnected: () => void = () => {},
    onDisconnected: () => void = () => {},
    onError: () => void = () => {}
): Promise<void> {
    try {
        const status: LedgerStatus = await getLedgerStatus()

        ledgerDeviceStatus.set(
            Object.assign({}, status, {
                connectionState: determineLedgerDeviceState(status),
            })
        )

        if (get(ledgerDeviceStatus).connected) {
            const isLedgerNotConnectedPopupOpened =
                get(popupState).active && get(popupState).type === 'ledgerNotConnected'

            if (isLedgerNotConnectedPopupOpened) {
                closePopup()
            }

            onConnected()
        } else {
            onDisconnected()
        }
    } catch (error) {
        onError()
    }
}
