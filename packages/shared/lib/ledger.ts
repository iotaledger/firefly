import { removeAddressChecksum } from 'shared/lib/migration'
import { closePopup, openPopup, popupState } from 'shared/lib/popup'
import { forceNextRoute, resetWalletRoute, walletSetupType } from 'shared/lib/router'
import { AppRoute, SetupType } from 'shared/lib/typings/routes'
import { api } from 'shared/lib/wallet'
import { get, writable } from 'svelte/store'
import { localize } from './i18n'
import { isNewNotification, showAppNotification } from './notifications'
import type { Event } from './typings/events'
import {
    LedgerApp,
    LedgerAppName,
    LedgerDeviceState,
    LedgerStatus,
    LegacyLedgerErrorCode,
    LegacyLedgerErrorName
} from './typings/ledger'
import type { NotificationType } from './typings/notification'


const LEDGER_STATUS_POLL_INTERVAL_ON_DISCONNECT = 1500

let polling = false
let intervalTimer

export const ledgerSimulator = true
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

export function isLedgerConnected(legacy: boolean = false): boolean {
    const state = get(ledgerDeviceState)
    return legacy ? state === LedgerDeviceState.LegacyConnected : state === LedgerDeviceState.Connected
}

export function calculateLedgerDeviceState(status: LedgerStatus): LedgerDeviceState {
    const { locked, connected, app } = status
    if (locked) {
        return LedgerDeviceState.Locked
    } else {
        switch (app?.name) {
            default:
                if (connected) {
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

export function displayNotificationForLedgerProfile(
    notificationType: NotificationType = 'error',
    allowMultiple: boolean = true,
    checkDeviceStatus: boolean = false,
    ignoreNotDetected: boolean = false,
    legacy: boolean = false,
    error: any = null
): string {
    let notificationId

    const _notify = () => {
        const state = get(ledgerDeviceState)

        const allowedToNotify = allowMultiple ? true : isNewNotification(notificationType)
        const canNotify = allowedToNotify && (ignoreNotDetected ? state !== LedgerDeviceState.NotDetected : true)

        const isConnected = (!legacy && state === LedgerDeviceState.Connected)
        const isLegacyConnected = (legacy && state === LedgerDeviceState.LegacyConnected)
        const shouldNotify = (!isConnected && !isLegacyConnected) || error

        if (canNotify && shouldNotify) {
            const stateErrorMessage = localize(`error.ledger.${state}`)
            const errorMessage = legacy ? getLegacyErrorMessage(error, true) : error?.error ? localize(error.error) : error

            const message = error ? isLedgerError(error) ? stateErrorMessage : errorMessage : stateErrorMessage
            notificationId = showAppNotification({
                type: notificationType,
                message
            })
        }
    }

    if (checkDeviceStatus) {
        getLedgerDeviceStatus(
            false,
            () => { },
            () => _notify(),
            () => _notify()
        )
    } else {
        _notify()
    }

    return notificationId
}

export function isLedgerError(error: any): boolean {
    if (!error) return false

    let errorType: string = ''
    switch (typeof error) {
        case 'object':
            errorType = error.type || error.name
            break
        case 'string':
            errorType = error
            break
    }

    return errorType?.slice(0, 6) === "Ledger"
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

export function getLegacyErrorMessage(error: any, shouldLocalize: boolean = false): string {
    let errorMessage = 'error.global.generic'
    switch (error?.name) {
        case LegacyLedgerErrorName.TransportStatusError:
            if (error?.statusCode === LegacyLedgerErrorCode.DeniedByTheUser) {
                errorMessage = 'error.send.cancelled'
            } else if (error?.statusCode === LegacyLedgerErrorCode.TimeoutExceeded) {
                errorMessage = 'error.ledger.timeout'
            } else if (error?.statusCode === LegacyLedgerErrorCode.Unknown) {
                errorMessage = 'error.ledger.generic'
            }
            break
        case LegacyLedgerErrorName.DisconnectedDevice:
        case LegacyLedgerErrorName.DisconnectedDeviceDuringOperation:
            errorMessage = 'error.ledger.disconnected'
            break
    }

    return shouldLocalize ? localize(errorMessage) : errorMessage
}

export function formatAddressForLedger(address: string, removeChecksum: boolean = false): string {
    if (removeChecksum) {
        address = removeAddressChecksum(address)
    }
    const len = address.length
    return `${address.slice(0, len / 2)}\n${address.slice(len / 2, len)}`
}

export function navigateToNewIndexMigration() {
    resetWalletRoute()
    walletSetupType.set(SetupType.TrinityLedger)
    forceNextRoute(AppRoute.LedgerSetup)
}