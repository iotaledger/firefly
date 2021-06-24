
import { Electron } from 'shared/lib/electron'
import { closePopup, openPopup, popupState } from 'shared/lib/popup'
import { LedgerStatus } from 'shared/lib/typings/wallet'
import { api } from 'shared/lib/wallet'
import { get, writable } from 'svelte/store'
import { localize } from './i18n'

export const ledgerSimulator = false
export const isLedgerConnected = writable<boolean>(true)
export const isLedgerLegacyConnected = writable<boolean>(true)

const DEFAULT_LEDGER_STATUS_POLL_INTERVAL = 1500

let polling = false
let ledgerPollInterval

export function getLedgerDeviceStatus(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const pollLedgerStatus = () => api.getLedgerDeviceStatus(ledgerSimulator, {
            onSuccess(response) {
                let _isLedgerConnected = response.payload?.type === LedgerStatus.Connected
                if (_isLedgerConnected) {
                    stopPollingLedgerStatus()
                    if (get(popupState).active) {
                        closePopup()
                    }
                    resolve()
                } else {
                    if (!polling) {
                        polling = true
                        ledgerPollInterval = setInterval(async () => {
                            pollLedgerStatus()
                        }, DEFAULT_LEDGER_STATUS_POLL_INTERVAL)
                        openLedgerNotConnectedPopup(false)
                    }
                }
                isLedgerConnected.set(_isLedgerConnected)
            },
            onError(err) {
                reject(err)
            },
        })
        pollLedgerStatus()
    })
}

function openLedgerNotConnectedPopup(legacy: boolean = false) {
    if (!get(popupState).active) {
        openPopup({
            type: 'ledgerNotConnected',
            hideClose: true,
            props: {
                message: localize(`popups.ledgerNotConnected.${legacy ? 'connectLegacy' : 'connect'}`)
            },
        })
    }
}

export function stopPollingLedgerStatus(): void {
    if (ledgerPollInterval) {
        clearInterval(ledgerPollInterval)
        ledgerPollInterval = null
    }
}

export function pollLedgerLegacyStatus(): void {
    Electron.ledger.addListener(ledgerLegacyListener)
}

export function stopPollingLedgerLegacyStatus(): void {
    Electron.ledger.removeListener(ledgerLegacyListener)
}

function ledgerLegacyListener(isConnected) {
    isLedgerLegacyConnected.set(isConnected)
    if (isConnected) {
        closePopup()
    } else {
        openLedgerNotConnectedPopup(true)
    }
}