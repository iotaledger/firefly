import { get } from 'svelte/store'

import { deconstructLedgerNanoStatusPollingConfiguration } from '../helpers'
import { ILedgerNanoStatusPollingConfiguration } from '../interfaces'
import { isPollingLedgerDeviceStatus } from '../stores'

import { getAndUpdateLedgerNanoStatus } from './getAndUpdateLedgerNanoStatus'

let intervalTimer

export function pollLedgerNanoStatus(config?: ILedgerNanoStatusPollingConfiguration): void {
    const { pollInterval, profileManager } = deconstructLedgerNanoStatusPollingConfiguration(config)

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
