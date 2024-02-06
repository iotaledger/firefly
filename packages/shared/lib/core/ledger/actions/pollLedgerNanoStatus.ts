import { get } from 'svelte/store'
import { DEFAULT_LEDGER_NANO_STATUS_POLL_INTERVAL } from '../constants'
import { isPollingLedgerDeviceStatus, ledgerNanoStatus } from '../stores'
import { getAndUpdateLedgerNanoStatus } from './getAndUpdateLedgerNanoStatus'
import { SecretManager } from '@iota/sdk'

let timeoutTimer: ReturnType<typeof setTimeout> | undefined

export function pollLedgerNanoStatus(secretManager?: SecretManager): void {

    const defaultPollInterval = DEFAULT_LEDGER_NANO_STATUS_POLL_INTERVAL
    const slowedPollInterval = 10 * defaultPollInterval

    if (!get(isPollingLedgerDeviceStatus)) {
        isPollingLedgerDeviceStatus.set(true)
        const pollingFunction = async (): Promise<void> => {
            await getAndUpdateLedgerNanoStatus(secretManager)
            const isLedgerBusy = get(ledgerNanoStatus)?.busy
            const currentPollInterval = isLedgerBusy ? slowedPollInterval : defaultPollInterval
            timeoutTimer = setTimeout(() => void pollingFunction(), currentPollInterval)
        }

        void pollingFunction()
    }
}

export function stopPollingLedgerNanoStatus(): void {
    if (get(isPollingLedgerDeviceStatus)) {
        clearInterval(timeoutTimer)
        timeoutTimer = undefined
        isPollingLedgerDeviceStatus.set(false)
    }
}
