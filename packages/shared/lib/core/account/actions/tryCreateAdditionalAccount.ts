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
    } catch (err) {
        if (err) {
            console.error(err?.error || err)
            if (get(isLedgerProfile)) {
                displayNotificationForLedgerProfile('error', true, false, false, false, err)
            } else {
                showAppNotification({
                    type: 'error',
                    message: localize(err?.error || err),
                })
            }
        }
        return Promise.reject()
    }
}
