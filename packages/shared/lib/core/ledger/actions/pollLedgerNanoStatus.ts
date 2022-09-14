import { get } from 'svelte/store'

import { deconstructLedgerStatusPollingConfiguration } from '../helpers'
import { ILedgerStatusPollingConfiguration } from '../interfaces'
import { isPollingLedgerDeviceStatus } from '../stores'

import { getAndUpdateLedgerNanoStatus } from './getAndUpdateLedgerNanoStatus'

let intervalTimer

export function pollLedgerNanoStatus(config?: ILedgerStatusPollingConfiguration): void {
    const { pollInterval, profileManager } = deconstructLedgerStatusPollingConfiguration(config)

    if (!get(isPollingLedgerDeviceStatus)) {
        void getAndUpdateLedgerNanoStatus(false, profileManager)
        intervalTimer = setInterval(() => {
            void getAndUpdateLedgerNanoStatus(false, profileManager)
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
