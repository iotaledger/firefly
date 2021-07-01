import { Electron } from 'shared/lib/electron'
import { closePopup, openPopup, popupState } from 'shared/lib/popup'
import { LedgerAppInfo, LedgerStatus } from 'shared/lib/typings/wallet'
import { api } from 'shared/lib/wallet'
import { get, writable } from 'svelte/store'

import type { Event } from "./typings/events";

export const ledgerSimulator = false
export const isLedgerConnected = writable<boolean>(false)
export const isLedgerLegacyConnected = writable<boolean>(false)

const LEDGER_STATUS_POLL_INTERVAL_ON_DISCONNECT = 1500

let polling = false
let intervalTimer

export function getLedgerDeviceStatus(onConnected = () => { }, onDisconnected = () => { }, onError = () => { }) {
    api.getLedgerDeviceStatus(ledgerSimulator, {
        onSuccess(response) {
            let _isLedgerConnected = response.payload?.type === LedgerStatus.Connected
            isLedgerConnected.set(_isLedgerConnected)
            if (_isLedgerConnected) {
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
    onConnected = () => { },
    onCancel = () => { },
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
        pollLedgerDeviceStatus(LEDGER_STATUS_POLL_INTERVAL_ON_DISCONNECT, _onConnected, _onDisconnected, _onCancel)
        if (!get(popupState).active) {
            openLedgerNotConnectedPopup(false, onCancel)
        }
    }
    getLedgerDeviceStatus(_onConnected, _onDisconnected, _onCancel)
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

export function addLedgerLegacyStatusListener(): void {
    Electron.ledger.addListener(ledgerLegacyListener)
}

export function removeLedgerLegacyStatusListener(): void {
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