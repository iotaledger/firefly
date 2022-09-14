import { get } from 'svelte/store'
import { LEDGER_STATUS_POLL_INTERVAL } from '../constants'
import { isPollingLedgerDeviceStatus } from '../stores'
import { getAndUpdateLedgerNanoStatus } from './getAndUpdateLedgerNanoStatus'

let intervalTimer

export function pollLedgerNanoStatus(pollInterval: number = LEDGER_STATUS_POLL_INTERVAL): void {
    if (!get(isPollingLedgerDeviceStatus)) {
        void getAndUpdateLedgerNanoStatus()
        intervalTimer = setInterval(() => {
            void getAndUpdateLedgerNanoStatus()
        }, pollInterval)
        isPollingLedgerDeviceStatus.set(true)
    }
}

export function stopPollingLedgerNanoStatus(): void {
    if (get(isPollingLedgerDeviceStatus)) {
        clearInterval(intervalTimer)
        intervalTimer = null
        isPollingLedgerDeviceStatus.set(false)
    }
}
