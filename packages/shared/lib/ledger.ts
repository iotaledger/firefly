
import { Electron } from 'shared/lib/electron'
import { closePopup, openPopup, popupState } from 'shared/lib/popup'
import { LedgerStatus } from 'shared/lib/typings/wallet'
import { api } from 'shared/lib/wallet'
import { get, writable } from 'svelte/store'
import { localize } from './i18n'

export const ledgerSimulator = true
export const isLedgerConnected = writable<boolean>(true)
export const isLedgerLegacyConnected = writable<boolean>(true)

const DEFAULT_LEDGER_STATUS_POLL_INTERVAL = 1000

export function getLedgerDeviceStatus(): void {
    api.getLedgerDeviceStatus(ledgerSimulator, {
        onSuccess(response) {
            let _isLedgerConnected = response.payload?.type === LedgerStatus.Connected
            if (_isLedgerConnected) {
                closePopup()
            } else {
                openLedgerNotConnectedPopup()
            }
            isLedgerConnected.set(_isLedgerConnected)
        },
        onError() {
            openLedgerNotConnectedPopup()
        },
    })
}

function openLedgerNotConnectedPopup(legacy: boolean = false) {
    if (!get(popupState).active) {
        openPopup({
            type: 'ledgerNotConnected',
            hideClose: true,
            props: {
                message: localize(`popups.ledgerNotConnected.${legacy ? 'connectLegacy' : 'connect'}`),
            },
        })
    }
}

let ledgerPollInterval

export function pollLedgerStatus(): void {
    if (!ledgerPollInterval) {
        getLedgerDeviceStatus()
        ledgerPollInterval = setInterval(async () => getLedgerDeviceStatus(), DEFAULT_LEDGER_STATUS_POLL_INTERVAL)
    }
}

export function stopPollLedgerStatus(): void {
    if (ledgerPollInterval) {
        clearInterval(ledgerPollInterval)
        ledgerPollInterval = null
    }
}

export function pollLedgerLegacyStatus(): void {
    Electron.ledger.addListener(ledgerLegacyListener)
}

export function stopPollLedgerLegacyStatus(): void {
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