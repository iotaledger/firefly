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
        const errorMessage = err?.error || err
        if (err) {
            console.error(errorMessage)
            if (get(isLedgerProfile)) {
                displayNotificationForLedgerProfile('error', true, false, false, false, err)
            } else {
                showAppNotification({
                    type: 'error',
                    message: localize(errorMessage) ?? errorMessage,
                })
            }
        }
        return Promise.reject({ error: errorMessage })
    }
}
