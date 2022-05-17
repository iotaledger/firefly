import { localize } from '@core/i18n'
import { isLedgerProfile } from '@core/profile'
import { displayNotificationForLedgerProfile } from '@lib/ledger'
import { showAppNotification } from '@lib/notifications'
import { get } from 'svelte/store'
import { createNewAccount } from './createNewAccount'
import { setSelectedAccount } from './setSelectedAccount'

export async function tryCreateAdditionalAccount(alias: string, color: string): Promise<void> {
    try {
        const account = await createNewAccount(alias, color)
        setSelectedAccount(account?.id)
        return Promise.resolve()
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
