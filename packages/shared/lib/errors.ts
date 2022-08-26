import { persistent } from 'shared/lib/helpers'
import { Error } from './typings/error'
import { ErrorEventPayload } from '@lib/typings/events'
import { get } from 'svelte/store'
import { isLedgerProfile } from '@lib/profile'
import { displayNotificationForLedgerProfile } from '@lib/ledger'
import { showAppNotification } from '@lib/notifications'
import { localize } from '@core/i18n'

export const errorLog = persistent<Error[]>('errorLog', [])

export const addError = (err: Error): void => {
    errorLog.update((log) => [err, ...log])
}

export function displayErrorEventToUser(error: ErrorEventPayload): void {
    if (get(isLedgerProfile)) {
        displayNotificationForLedgerProfile('error', true, true, false, false, error)
    } else {
        showAppNotification({
            type: 'error',
            message: localize(error.error),
        })
    }
}
