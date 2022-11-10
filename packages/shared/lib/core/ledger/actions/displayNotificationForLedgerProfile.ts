import { get } from 'svelte/store'

import { localize } from '@core/i18n'
import { NotificationType } from '@auxiliary/notification'
import { isNewNotification, showAppNotification } from '@auxiliary/notification'

import { ledgerConnectionState } from '../stores'
import { getLedgerDeviceStatus } from './getLedgerDeviceStatus'

export function displayNotificationForLedgerProfile(
    notificationType: NotificationType = 'error',
    allowMultiple: boolean = true,
    checkDeviceStatus: boolean = false,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: any = null
): string {
    let notificationId

    const _notify: () => void = () => {
        const _ledgerConnectionState = get(ledgerConnectionState)
        const allowedToNotify = allowMultiple ? true : isNewNotification(notificationType)

        const shouldNotify = allowedToNotify
        if (shouldNotify) {
            const stateErrorMessage = localize(`error.ledger.${_ledgerConnectionState}`)
            const errorMessage = error?.error ? localize(error.error) : error
            const message = error ? errorMessage : stateErrorMessage
            notificationId = showAppNotification({
                type: notificationType,
                alert: true,
                message,
            })
        }
    }

    if (checkDeviceStatus) {
        void getLedgerDeviceStatus()
    } else {
        _notify()
    }

    return notificationId
}
