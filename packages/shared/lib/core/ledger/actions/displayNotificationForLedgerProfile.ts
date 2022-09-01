import { get } from 'svelte/store'

import { localize } from '@core/i18n'
import { NotificationType } from '@lib/typings/notification'
import { isNewNotification, showAppNotification } from '@lib/notifications'

import { ledgerDeviceStatus } from '../stores'
import { getLedgerDeviceStatus } from './getLedgerDeviceStatus'

export function displayNotificationForLedgerProfile(
    notificationType: NotificationType = 'error',
    allowMultiple: boolean = true,
    checkDeviceStatus: boolean = false,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: any = null
): string {
    let notificationId

    const _notify = () => {
        const status = get(ledgerDeviceStatus)
        const allowedToNotify = allowMultiple ? true : isNewNotification(notificationType)

        const shouldNotify = allowedToNotify
        if (shouldNotify) {
            const stateErrorMessage = localize(`error.ledger.${status.connectionState}`)
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
        getLedgerDeviceStatus()
    } else {
        _notify()
    }

    return notificationId
}
