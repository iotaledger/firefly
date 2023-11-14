import { get } from 'svelte/store'
import { DEFAULT_LEDGER_NANO_STATUS_POLL_INTERVAL } from '../constants'
import { deconstructLedgerNanoStatusPollingConfiguration } from '../helpers'
import { ILedgerNanoStatusPollingConfiguration } from '../interfaces'
import { isPollingLedgerDeviceStatus, ledgerNanoStatus } from '../stores'
import { getAndUpdateLedgerNanoStatus } from './getAndUpdateLedgerNanoStatus'

let intervalTimer: ReturnType<typeof setInterval> | null

export function pollLedgerNanoStatus(config?: ILedgerNanoStatusPollingConfiguration): void {
    const { pollInterval, profileManager } = deconstructLedgerNanoStatusPollingConfiguration(config)

    const defaultPollInterval = pollInterval || DEFAULT_LEDGER_NANO_STATUS_POLL_INTERVAL
    const slowedPollInterval = 10 * defaultPollInterval

    if (!get(isPollingLedgerDeviceStatus)) {
        isPollingLedgerDeviceStatus.set(true)
        const pollingFunction = async (): Promise<void> => {
            await getAndUpdateLedgerNanoStatus(profileManager)
            const isLedgerBusy = get(ledgerNanoStatus)?.busy
            const currentPollInterval = isLedgerBusy ? slowedPollInterval : defaultPollInterval
            intervalTimer = setTimeout(() => void pollingFunction(), currentPollInterval)
        }

        void pollingFunction()
    }
}

export function stopPollingLedgerNanoStatus(): void {
    if (get(isPollingLedgerDeviceStatus)) {
        if (intervalTimer) {
            clearInterval(intervalTimer)
        }
        intervalTimer = null
        isPollingLedgerDeviceStatus.set(false)
    }
}
