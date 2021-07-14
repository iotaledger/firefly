import { closePopup, openPopup, popupState } from 'shared/lib/popup'
import { api } from 'shared/lib/wallet'
import { get, writable } from 'svelte/store'
import type { Event } from "./typings/events"
import { LedgerAppName, LedgerDeviceState, LedgerStatus } from "./typings/ledger"

const LEDGER_STATUS_POLL_INTERVAL_ON_DISCONNECT = 1500

let polling = false
let intervalTimer

export const ledgerSimulator = false
export const ledgerDeviceState = writable<LedgerDeviceState>(LedgerDeviceState.NotDetected)
export const isLedgerLegacyConnected = writable<boolean>(false)

export function getLedgerDeviceStatus(
    legacy: boolean = false,
    onConnected: () => void = () => { },
    onDisconnected: () => void = () => { },
    onError: () => void = () => { }
) {
    api.getLedgerDeviceStatus(ledgerSimulator, {
        onSuccess(response: Event<LedgerStatus>) {
            ledgerDeviceState.set(calculateLedgerDeviceState(response.payload))

            const state = get(ledgerDeviceState)
            const isConnected = (legacy && state === LedgerDeviceState.LegacyConnected)
                            || (!legacy && state === LedgerDeviceState.Connected)
            if (isConnected) {
                onConnected()
            } else {
                onDisconnected()
            }
        },
        onError(err) {
            onError()
        }
    })
}

export function calculateLedgerDeviceState(status: LedgerStatus): LedgerDeviceState {
    const { locked, connected, app } = status
    if (locked) {
        return LedgerDeviceState.Locked
    } else {
        if (app?.name === LedgerAppName.IOTA) {
            return LedgerDeviceState.Connected
        } else if (app?.name === LedgerAppName.IOTALegacy) {
            return LedgerDeviceState.LegacyConnected
        } else {
            return connected ? LedgerDeviceState.AppNotOpen : LedgerDeviceState.NotDetected
        }
    }
}

export function promptUserToConnectLedger(
    legacy: boolean = false,
    onConnected: () => void = () => { },
    onCancel: () => void = () => { },
) {
    const _onCancel = () => {
        stopPollingLedgerStatus()
        onCancel()
    }
    const _onConnected = () => {
        stopPollingLedgerStatus()
        if (get(popupState).active) {
            closePopup()
        }
        onConnected()
    }
    const _onDisconnected = () => {
        pollLedgerDeviceStatus(legacy, LEDGER_STATUS_POLL_INTERVAL_ON_DISCONNECT, _onConnected, _onDisconnected, _onCancel)
        if (!get(popupState).active) {
            openLedgerNotConnectedPopup(legacy, onCancel)
        }
    }
    getLedgerDeviceStatus(legacy, _onConnected, _onDisconnected, _onCancel)
}

export function pollLedgerDeviceStatus(
    legacy: boolean = false,
    pollInterval: number = 1000,
    _onConnected: () => void = () => { },
    _onDisconnected: () => void = () => { },
    _onCancel: () => void = () => { }
) {
    if (!polling) {
        getLedgerDeviceStatus(legacy, _onConnected, _onDisconnected, _onCancel)
        intervalTimer = setInterval(async () => {
            getLedgerDeviceStatus(legacy, _onConnected, _onDisconnected, _onCancel)
        }, pollInterval)
    }
    polling = true
}

function openLedgerNotConnectedPopup(
    legacy: boolean = false,
    cancel: () => void = () => { }
) {
    if (!get(popupState).active) {
        openPopup({
            type: 'ledgerNotConnected',
            hideClose: true,
            props: {
                legacy,
                handleClose: () => cancel()
            },
        })
    }
}

export function stopPollingLedgerStatus(): void {
    if (intervalTimer) {
        clearInterval(intervalTimer)
        intervalTimer = null
        polling = false
    }
}