import { get, writable } from 'svelte/store'
import { localize } from '@core/i18n'
import { AppRoute, appRouter, resetWalletRoute } from '@core/router'
import { ProfileRecoveryType, updateOnboardingProfile } from '@contexts/onboarding'

import { removeAddressChecksum } from './migration'
import { isNewNotification, showAppNotification } from './notifications'
import { openPopup, popupState } from './popup'
import {
    LedgerAppName,
    LedgerDeviceState,
    LedgerStatus,
    LegacyLedgerErrorCode,
    LegacyLedgerErrorName,
} from './typings/ledger'
import { NotificationType } from './typings/notification'

// const LEDGER_STATUS_POLL_INTERVAL_ON_DISCONNECT = 1500
const LEGACY_ADDRESS_WITH_CHECKSUM_LENGTH = 90

let intervalTimer

export const ledgerSimulator = false
export const ledgerDeviceState = writable<LedgerDeviceState>(LedgerDeviceState.NotDetected)
export const isLedgerLegacyConnected = writable<boolean>(false)

// export function getLedgerDeviceStatus(
//     legacy: boolean = false,
//     onConnected: () => void = () => {},
//     onDisconnected: () => void = () => {},
//     onError: () => void = () => {}
// ): void {
// api.getLedgerDeviceStatus(ledgerSimulator, {
//     onSuccess(response: Event<LedgerStatus>) {
//         ledgerDeviceState.set(calculateLedgerDeviceState(response.payload))

//         const state = get(ledgerDeviceState)
//         const isConnected =
//             (legacy && state === LedgerDeviceState.LegacyConnected) ||
//             (!legacy && state === LedgerDeviceState.Connected)
//         if (isConnected) {
//             if (get(popupState).active && get(popupState).type === 'ledgerNotConnected') {
//                 closePopup()
//             }
//             onConnected()
//         } else {
//             onDisconnected()
//         }
//     },
//     onError() {
//         onError()
//     },
// })
// }

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
                    return app?.name && app?.name !== LedgerAppName.BOLOS
                        ? LedgerDeviceState.OtherConnected
                        : LedgerDeviceState.AppNotOpen
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

// export function getLedgerOpenedApp(): Promise<LedgerApp> {
//     return new Promise<LedgerApp>((resolve, reject) => {
//         api.getLedgerDeviceStatus(ledgerSimulator, {
//             onSuccess(response: Event<LedgerStatus>) {
//                 resolve(response.payload?.app)
//             },
//             onError(err) {
//                 reject(err)
//             },
//         })
//     })
// }

export function promptUserToConnectLedger(
    legacy: boolean = false,
    onConnected: () => void | Promise<void> = () => {},
    onCancel: () => void = () => {},
    overridePopup: boolean = false
): void {
    const _onCancel = () => {
        onCancel()
    }
    const _onConnected = () => {
        void onConnected()
    }
    const _onDisconnected = () => {
        if (!get(popupState).active || overridePopup) {
            openLedgerNotConnectedPopup(
                legacy,
                onCancel,
                // TODO: remove dummy code & replace w/ pollLedgerDeviceStatus
                () => {
                    _onCancel()
                    _onConnected()
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    _onDisconnected()
                },
                // pollLedgerDeviceStatus(
                //     legacy,
                //     LEDGER_STATUS_POLL_INTERVAL_ON_DISCONNECT,
                //     _onConnected,
                //     _onDisconnected,
                //     _onCancel
                // ),
                overridePopup
            )
        }
    }
    // getLedgerDeviceStatus(legacy, _onConnected, _onDisconnected, _onCancel)
}

export function displayNotificationForLedgerProfile(
    notificationType: NotificationType = 'error',
    allowMultiple: boolean = true,
    checkDeviceStatus: boolean = false,
    ignoreNotDetected: boolean = false,
    legacy: boolean = false,
    /* eslint-disable @typescript-eslint/no-explicit-any */
    error: any = null
): string {
    let notificationId

    const _notify = () => {
        const state = get(ledgerDeviceState)

        const allowedToNotify = allowMultiple ? true : isNewNotification(notificationType)
        const canNotify = allowedToNotify && (ignoreNotDetected ? state !== LedgerDeviceState.NotDetected : true)

        const isConnected = !legacy && state === LedgerDeviceState.Connected
        const isLegacyConnected = legacy && state === LedgerDeviceState.LegacyConnected
        const shouldNotify = (!isConnected && !isLegacyConnected) || error

        if (canNotify && shouldNotify) {
            const stateErrorMessage = localize(`error.ledger.${state}`)
            const errorMessage = legacy
                ? getLegacyErrorMessage(error, true)
                : error?.error
                ? localize(error.error)
                : error

            const message = error ? (isLedgerError(error) ? stateErrorMessage : errorMessage) : stateErrorMessage
            notificationId = showAppNotification({
                type: notificationType,
                message,
            })
        }
    }

    if (checkDeviceStatus) {
        // getLedgerDeviceStatus()
    } else {
        _notify()
    }

    return notificationId
}

export function isLedgerError(error: { name; type }): boolean {
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

    return errorType?.slice(0, 6) === 'Ledger'
}

export const isPollingLedgerDeviceStatus = writable<boolean>(false)

// export function pollLedgerDeviceStatus(
//     legacy: boolean = false,
//     pollInterval: number = 1000,
//     _onConnected: () => void = () => {},
//     _onDisconnected: () => void = () => {},
//     _onCancel: () => void = () => {}
// ): void {
//     if (!get(isPollingLedgerDeviceStatus)) {
//         // getLedgerDeviceStatus(legacy, _onConnected, _onDisconnected, _onCancel)
//         /* eslint-disable @typescript-eslint/no-misused-promises */
//         intervalTimer = setInterval(() => {
//             // getLedgerDeviceStatus(legacy, _onConnected, _onDisconnected, _onCancel)
//         }, pollInterval)
//         isPollingLedgerDeviceStatus.set(true)
//     }
// }

function openLedgerNotConnectedPopup(
    legacy: boolean = false,
    cancel: () => void = () => {},
    poll: () => void = () => {},
    overridePopup: boolean = false
) {
    if (!get(popupState).active || overridePopup) {
        openPopup({
            type: 'ledgerNotConnected',
            hideClose: true,
            props: {
                legacy,
                handleClose: () => cancel(),
                poll,
            },
        })
    }
}

export function stopPollingLedgerStatus(): void {
    if (get(isPollingLedgerDeviceStatus)) {
        clearInterval(intervalTimer)
        intervalTimer = null
        isPollingLedgerDeviceStatus.set(false)
    }
}

export function getLegacyErrorMessage(error: { name; statusCode }, shouldLocalize: boolean = false): string {
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
    if (address.length === LEGACY_ADDRESS_WITH_CHECKSUM_LENGTH && removeChecksum) {
        address = removeAddressChecksum(address)
    }
    const len = address.length
    return `${address.slice(0, len / 2)}\n${address.slice(len / 2, len)}`
}

export function navigateToNewIndexMigration(): void {
    resetWalletRoute()
    updateOnboardingProfile({ recoveryType: ProfileRecoveryType.TrinityLedger })
    get(appRouter).forceNextRoute(AppRoute.Onboarding)
    // get(onboardingRouter).(OnboardingRoute.LedgerSetup)
}
