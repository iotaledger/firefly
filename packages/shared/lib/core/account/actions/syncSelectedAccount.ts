import { localize } from '@core/i18n'
import { isLedgerProfile } from '@core/profile'
import { displayNotificationForLedgerProfile } from '@lib/core/ledger'
import { showAppNotification } from '@lib/notifications'
import { get } from 'svelte/store'
import { updateSelectedAccount, selectedAccount } from '../stores'

export async function syncSelectedAccount(): Promise<void> {
    updateSelectedAccount({ isSyncing: true })
    try {
        await get(selectedAccount).sync()
        updateSelectedAccount({
            isSyncing: false,
        })
    } catch (err) {
        updateSelectedAccount({ isSyncing: false })
        const shouldHideErrorNotification =
            err && err.type === 'ClientError' && err.error === 'error.node.chrysalisNodeInactive'
        if (!shouldHideErrorNotification) {
            if (get(isLedgerProfile)) {
                displayNotificationForLedgerProfile('error', true, true, err)
            } else {
                showAppNotification({
                    type: 'error',
                    message: localize(err.error),
                })
            }
        }
    }
}
