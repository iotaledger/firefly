import { closePopup, openPopup, popupState } from 'shared/lib/popup'
import { api } from 'shared/lib/wallet'
import { get, writable } from 'svelte/store'
import type { Event } from "./typings/events"
import { ErrorType } from "./typings/events"
import { LedgerApp, LedgerAppInfo, LedgerDeviceState, LedgerStatus } from "./typings/ledger"

const LEDGER_STATUS_POLL_INTERVAL_ON_DISCONNECT = 1500

let polling = false
let pollingLegacy = false
let intervalTimer
let intervalTimerLegacy

export const ledgerSimulator = false
export const ledgerDeviceState = writable<LedgerDeviceState>(LedgerDeviceState.NotDetected)

export function getLedgerDeviceStatus(onConnected = () => { }, onDisconnected = () => { }, onError = () => { }) {
    api.getLedgerDeviceStatus(ledgerSimulator, {
        onSuccess(response) {
            if (response.payload?.type === LedgerStatus.Connected) {
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

export function updateLedgerDeviceState(onSuccess = () => { }, onError = () => { }) {
    asyncGetLedgerOpenedApp(ledgerSimulator)
        .then((data: LedgerAppInfo) => {
            let _state = LedgerDeviceState.AppNotOpen
            if (data.name === LedgerApp.IOTA) {
                _state = LedgerDeviceState.Connected
            } else if (data.name === LedgerApp.IOTALegacy) {
                _state = LedgerDeviceState.LegacyConnected
            }
            ledgerDeviceState.set(_state)
            onSuccess()
        })
        .catch((err) => {
            if (err.type === ErrorType.LedgerDeviceNotFound)
                ledgerDeviceState.set(LedgerDeviceState.NotDetected)
            else
                console.error(err)
            onError()
        })
}

export function asyncGetLedgerOpenedApp(isSimulator: boolean) {
    return new Promise<LedgerAppInfo>((resolve, reject) => {
        api.getLedgerOpenedApp(isSimulator, {
            onSuccess(response: Event<LedgerAppInfo>) {
                resolve(response.payload)
            },
            onError(err) {
                reject(err)
            }
        })
    })
}

export function promptUserToConnectLedger(
    legacy: boolean = false,
    onConnected = () => { },
    onCancel = () => { },
) {
    const _onCancel = () => {
        if (legacy) {
            stopPollingLedgerLegacyStatus()
        } else {
            stopPollingLedgerStatus()
        }
        onCancel()
    }
    const _onConnected = () => {
        if (legacy) {
            stopPollingLedgerLegacyStatus()
        } else {
            stopPollingLedgerStatus()
        }
        if (get(popupState).active) {
            closePopup()
        }
        onConnected()
    }
    const _onDisconnected = () => {
        if (!legacy) {
            pollLedgerDeviceStatus(LEDGER_STATUS_POLL_INTERVAL_ON_DISCONNECT, _onConnected, _onDisconnected, _onCancel)
        }
        if (!get(popupState).active) {
            openLedgerNotConnectedPopup(legacy, onCancel)
        }
    }
    if (legacy) {
        pollLedgerLegacyDeviceStatus(LEDGER_STATUS_POLL_INTERVAL_ON_DISCONNECT, _onConnected, _onDisconnected)
    } else {
        getLedgerDeviceStatus(_onConnected, _onDisconnected, _onCancel)
    }
}

export function pollLedgerDeviceStatus(pollInterval, _onConnected = () => { }, _onDisconnected = () => { }, _onCancel = () => { }) {
    if (!polling) {
        getLedgerDeviceStatus(_onConnected, _onDisconnected, _onCancel)
        intervalTimer = setInterval(async () => {
            getLedgerDeviceStatus(_onConnected, _onDisconnected, _onCancel)
        }, pollInterval)
    }
    polling = true
}

function openLedgerNotConnectedPopup(legacy: boolean = false, cancel = () => { }) {
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

function checkLegacyConnection(onConnected = () => { }, onDisconnected = () => { }) {
    const _callBack = () => {
        // TODO: missing open app but locked
        if (get(ledgerDeviceState) === LedgerDeviceState.LegacyConnected) {
            onConnected()
        }
        else {
            onDisconnected()
        }
    }
    updateLedgerDeviceState(_callBack, _callBack)
}

export function pollLedgerLegacyDeviceStatus(pollInterval, onConnected = () => { }, onDisconnected = () => { }) {
    if (!pollingLegacy) {
        checkLegacyConnection(onConnected, onDisconnected)
        intervalTimerLegacy = setInterval(async () => {
            checkLegacyConnection(onConnected, onDisconnected)
        }, pollInterval)
    }
    pollingLegacy = true
}

export function stopPollingLedgerLegacyStatus(): void {
    if (intervalTimerLegacy) {
        clearInterval(intervalTimerLegacy)
        intervalTimerLegacy = null
        pollingLegacy = false
    }
}