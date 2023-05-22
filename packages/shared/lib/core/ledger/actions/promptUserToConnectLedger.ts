import { get } from 'svelte/store'

import { popupState } from '../../../../../desktop/lib/auxiliary/popup'

import { openLedgerNotConnectedPopup } from '../utils'

import { getLedgerDeviceStatus } from './getLedgerDeviceStatus'
import { pollLedgerNanoStatus } from './pollLedgerNanoStatus'

export function promptUserToConnectLedger(
    onConnected = (): void => {},
    onCancel = (): void => {},
    overridePopup: boolean = false
): void {
    function onDisconnected(): void {
        if (!get(popupState).active || overridePopup) {
            openLedgerNotConnectedPopup(onCancel, () => pollLedgerNanoStatus(), overridePopup)
        }
    }

    void getLedgerDeviceStatus(onConnected, onDisconnected, onCancel)
}
