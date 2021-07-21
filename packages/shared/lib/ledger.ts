import { closePopup, openPopup, popupState } from 'shared/lib/popup'
import { api } from 'shared/lib/wallet'
import { get, writable } from 'svelte/store'
import type { Event } from './typings/events'
import {
    LedgerApp,
    LedgerAppName,
    LedgerDeviceState,
    LedgerStatus,
    LegacyLedgerErrorCode,
    LegacyLedgerErrorName
} from './typings/ledger'
import { isNewNotification, showAppNotification } from './notifications'
import { localize } from './i18n'
import type { NotificationType } from './typings/notification'

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
        switch(app?.name) {
            default:
                if(connected) {
                    /**
                     * NOTE: "BOLOS" is the name of the Ledger operating system and is
                     * sometimes registered as an app.
                     */
                    return (app?.name && app?.name !== LedgerAppName.BOLOS) ? LedgerDeviceState.OtherConnected : LedgerDeviceState.AppNotOpen
                } else {
                    return LedgerDeviceState.NotDetected
                }
            case LedgerAppName.IOTA:
                return LedgerDeviceState.Connected
            case LedgerAppName.IOTALegacy:
                return LedgerDeviceState.LegacyConnected
        }
    }
}

export function getLedgerOpenedApp(): Promise<LedgerApp> {
    return new Promise<LedgerApp>((resolve, reject) => {
        api.getLedgerDeviceStatus(ledgerSimulator, {
            onSuccess(response: Event<LedgerStatus>) {
                resolve(response.payload?.app)
            },
            onError(err) {
                reject(err)
            }
        })
    })
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

export function notifyLedgerDeviceState(
    notificationType: NotificationType = 'error',
    allowMultiple: boolean = true,
    checkDeviceStatus: boolean = false,
    ignoreNotDetected: boolean = false,
    legacy: boolean = false,
    error: any = null
): void {
    const _notify = () => {
        const state = get(ledgerDeviceState)

        const allowedToNotify = allowMultiple ? true : isNewNotification(notificationType)
        const canNotify = allowedToNotify && (ignoreNotDetected ? state !== LedgerDeviceState.NotDetected : true)

        const isConnected =  (!legacy && state === LedgerDeviceState.Connected)
        const isLegacyConnected = (legacy && state === LedgerDeviceState.LegacyConnected)
        const shouldNotify = (!isConnected && !isLegacyConnected) || error

        if(canNotify && shouldNotify) {
            const message = error ? isConnected ? localize(error?.error) : localize(getLegacyErrorMessage(error))
                                  : localize(`error.ledger.${state}`)
            showAppNotification({
                type: notificationType,
                message: message
            })
        }
    }

    if(checkDeviceStatus) {
        getLedgerDeviceStatus(
            false,
            () => {},
            () => _notify(),
            () => _notify()
        )
    } else {
        _notify()
    }
}

export function formatToLedgerDisplay(s: string): string {
    return s.match(/.{1,16}/g).join('\n')
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

export function getLegacyErrorMessage(error: any): string {
    let errorMessage = 'error.global.generic'
    switch (error?.name) {
        case LegacyLedgerErrorName.TransportStatusError:
            if (error?.statusCode === LegacyLedgerErrorCode.DeniedByTheUser) {
                errorMessage = 'error.send.cancelled'
                break
            } else if (error?.statusCode === LegacyLedgerErrorCode.TimeoutExceeded) {
                errorMessage = 'error.ledger.timeout'
            }
            break
        case LegacyLedgerErrorName.DisconnectedDevice:
        case LegacyLedgerErrorName.DisconnectedDeviceDuringOperation:
            errorMessage = 'error.ledger.disconnected'
            break
    }
    return errorMessage
}
