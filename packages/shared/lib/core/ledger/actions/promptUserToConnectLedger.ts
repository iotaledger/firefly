import { get } from 'svelte/store'

import { popupState } from '@lib/popup'

import { openLedgerNotConnectedPopup } from '../utils'

import { getLedgerDeviceStatus } from './getLedgerDeviceStatus'
import { pollLedgerNanoStatus } from './pollLedgerNanoStatus'

export function promptUserToConnectLedger(
    onConnected: () => void = (): void => {},
    onCancel: () => void = (): void => {},
    overridePopup: boolean = false
): void {
    function onDisconnected(): void {
        if (!get(popupState).active || overridePopup) {
            openLedgerNotConnectedPopup(onCancel, () => pollLedgerNanoStatus(), overridePopup)
        }
    }

    void getLedgerDeviceStatus(onConnected, onDisconnected, onCancel)
}
