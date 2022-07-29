import { derived, get, writable } from 'svelte/store'
import { resetWalletRoute, appRouter, AppRoute } from '@core/router'
import { profileRecoveryType, ProfileRecoveryType } from '@contexts/onboarding'
import { getLedgerStatus } from '@core/profile-manager'

import { removeAddressChecksum } from './migration'
import { openPopup, popupState } from './popup'
import { LedgerStatus } from '@iota/wallet'
import { NotificationType } from './typings/notification'

// const LEDGER_STATUS_POLL_INTERVAL_ON_DISCONNECT = 1500
const LEGACY_ADDRESS_WITH_CHECKSUM_LENGTH = 90

let intervalTimer

export const ledgerSimulator = false
export const ledgerDeviceState = writable<LedgerStatus>({
    connected: false,
    locked: false,
    blindSigningEnabled: false,
})

export const isDeviceConnected = derived(ledgerDeviceState, (state) => state.connected === true)
export const isDeviceLocked = derived(ledgerDeviceState, (state) => state.locked === true)
export const isAppOpened = derived(ledgerDeviceState, (state) => 'app' in state)
export const deviceStatus = derived(ledgerDeviceState, () => {
    if (get(isDeviceLocked)) {
        return 'locked'
    }

    if (!get(isDeviceConnected)) {
        return 'connected'
    }

    if (!get(isAppOpened)) {
        return 'appNotOpen'
    }
})

export async function getLedgerDeviceStatus(
    /* eslint-disable @typescript-eslint/no-unused-vars */
    onConnected: () => void = () => {},
    /* eslint-disable @typescript-eslint/no-unused-vars */
    onDisconnected: () => void = () => {},
    /* eslint-disable @typescript-eslint/no-unused-vars */
    onError: () => void = () => {}
): Promise<void> {
    const status: LedgerStatus = await getLedgerStatus()

    ledgerDeviceState.set(status)
    // api.getLedgerDeviceStatus(ledgerSimulator, {
    //     onSuccess(response: Event<LedgerStatus>) {

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
}

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
    /* eslint-disable @typescript-eslint/no-unused-vars */
    error: any = null
): string {
    let notificationId

    const _notify = () => {
        // const state = get(ledgerDeviceState)
        // const allowedToNotify = allowMultiple ? true : isNewNotification(notificationType)
        // const canNotify = allowedToNotify && (ignoreNotDetected ? state !== LedgerDeviceState.NotDetected : true)
        // const isConnected = !legacy && state === LedgerDeviceState.Connected
        // const isLegacyConnected = legacy && state === LedgerDeviceState.LegacyConnected
        // const shouldNotify = (!isConnected && !isLegacyConnected) || error
        // if (canNotify && shouldNotify) {
        //     const stateErrorMessage = localize(`error.ledger.${state}`)
        //     const errorMessage = legacy
        //         ? getLegacyErrorMessage(error, true)
        //         : error?.error
        //             ? localize(error.error)
        //             : error
        //     const message = error ? (isLedgerError(error) ? stateErrorMessage : errorMessage) : stateErrorMessage
        //     notificationId = showAppNotification({
        //         type: notificationType,
        //         message,
        //     })
        // }
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

export function pollLedgerDeviceStatus(
    pollInterval: number = 1000,
    _onConnected: () => void = () => {},
    _onDisconnected: () => void = () => {},
    _onCancel: () => void = () => {}
): void {
    if (!get(isPollingLedgerDeviceStatus)) {
        getLedgerDeviceStatus(_onConnected, _onDisconnected, _onCancel)
        intervalTimer = setInterval(() => {
            getLedgerDeviceStatus(_onConnected, _onDisconnected, _onCancel)
        }, pollInterval)

        isPollingLedgerDeviceStatus.set(true)
    }
}

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

// export function getLegacyErrorMessage(error: { name; statusCode }, shouldLocalize: boolean = false): string {
//     let errorMessage = 'error.global.generic'
//     switch (error?.name) {
//         case LegacyLedgerErrorName.TransportStatusError:
//             if (error?.statusCode === LegacyLedgerErrorCode.DeniedByTheUser) {
//                 errorMessage = 'error.send.cancelled'
//             } else if (error?.statusCode === LegacyLedgerErrorCode.TimeoutExceeded) {
//                 errorMessage = 'error.ledger.timeout'
//             } else if (error?.statusCode === LegacyLedgerErrorCode.Unknown) {
//                 errorMessage = 'error.ledger.generic'
//             }
//             break
//         case LegacyLedgerErrorName.DisconnectedDevice:
//         case LegacyLedgerErrorName.DisconnectedDeviceDuringOperation:
//             errorMessage = 'error.ledger.disconnected'
//             break
//     }

//     return shouldLocalize ? localize(errorMessage) : errorMessage
// }

export function formatAddressForLedger(address: string, removeChecksum: boolean = false): string {
    if (address.length === LEGACY_ADDRESS_WITH_CHECKSUM_LENGTH && removeChecksum) {
        address = removeAddressChecksum(address)
    }
    const len = address.length
    return `${address.slice(0, len / 2)}\n${address.slice(len / 2, len)}`
}

export function navigateToNewIndexMigration(): void {
    resetWalletRoute()
    profileRecoveryType.set(ProfileRecoveryType.TrinityLedger)
    get(appRouter).forceNextRoute(AppRoute.Onboarding)
    // get(onboardingRouter).(OnboardingRoute.LedgerSetup)
}
