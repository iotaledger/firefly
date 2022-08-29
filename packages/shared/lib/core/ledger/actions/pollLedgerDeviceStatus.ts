import { get } from 'svelte/store'

import { LEDGER_STATUS_POLL_INTERVAL } from '../constants'
import { isPollingLedgerDeviceStatus } from '../stores'

import { getLedgerDeviceStatus } from './getLedgerDeviceStatus'

let intervalTimer

export function pollLedgerDeviceStatus(
    pollInterval: number = LEDGER_STATUS_POLL_INTERVAL,
    _onConnected: () => void = () => {},
    _onDisconnected: () => void = () => {},
    _onCancel: () => void = () => {}
): void {
    if (!get(isPollingLedgerDeviceStatus)) {
        getLedgerDeviceStatus(_onConnected, _onDisconnected, _onCancel)
        intervalTimer = setInterval(() => {
            getLedgerDeviceStatus(_onConnected, _onDisconnected, _onCancel)
        }, pollInterval)

        isPollingLedgerDeviceStatus.set(true)
    }
}

export function stopPollingLedgerStatus(): void {
    if (get(isPollingLedgerDeviceStatus)) {
        clearInterval(intervalTimer)
        intervalTimer = null
        isPollingLedgerDeviceStatus.set(false)
    }
}
