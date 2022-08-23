import { localize } from '@core/i18n'
import { isLedgerProfile, updateActiveAccountMetadata } from '@core/profile'
import { displayNotificationForLedgerProfile } from '@core/ledger'
import { showAppNotification } from '@lib/notifications'
import { get } from 'svelte/store'
import { IAccountMetadata } from '../interfaces'
import { selectedAccount, updateSelectedAccount } from '../stores'

export async function tryEditSelectedAccountMetadata(metadata: Partial<IAccountMetadata>): Promise<void> {
    try {
        // TODO: Replace Promise.resolve() with update metadata in wallet.rs when api is exposed
        await Promise.resolve()
        updateActiveAccountMetadata(get(selectedAccount)?.id, metadata)
        updateSelectedAccount(metadata)
    } catch (error) {
        if (error) {
            console.error(error?.error || error)
            if (get(isLedgerProfile)) {
                displayNotificationForLedgerProfile('error', true, false, error)
            } else {
                showAppNotification({
                    type: 'error',
                    message: localize(error?.error || error),
                })
            }
        }
        return Promise.reject()
    }
}
