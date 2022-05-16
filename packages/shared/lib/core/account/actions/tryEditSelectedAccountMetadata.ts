import { localize } from '@core/i18n'
import { isLedgerProfile } from '@core/profile'
import { displayNotificationForLedgerProfile } from '@lib/ledger'
import { showAppNotification } from '@lib/notifications'
import { get } from 'svelte/store'
import { IAccountMetadata } from '../interfaces'

export async function tryEditSelectedAccountMetadata(metadata: Partial<IAccountMetadata>): Promise<void> {
    try {
        return Promise.reject('Not implemented')
    } catch (reason) {
        if (reason) {
            console.error(reason?.error || reason)
            if (get(isLedgerProfile)) {
                displayNotificationForLedgerProfile('error', true, false, false, false, reason)
            } else {
                showAppNotification({
                    type: 'error',
                    message: localize(reason?.error || reason),
                })
            }
        }
        return Promise.reject()
    }
}
