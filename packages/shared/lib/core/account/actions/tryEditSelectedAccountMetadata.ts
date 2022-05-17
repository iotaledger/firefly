import { localize } from '@core/i18n'
import { isLedgerProfile, updateAccountMetadataOnActiveProfile } from '@core/profile'
import { displayNotificationForLedgerProfile } from '@lib/ledger'
import { showAppNotification } from '@lib/notifications'
import { get } from 'svelte/store'
import { IAccountMetadata } from '../interfaces'
import { selectedAccount, updateSelectedAccount } from '../stores'

export async function tryEditSelectedAccountMetadata(metadata: Partial<IAccountMetadata>): Promise<void> {
    try {
        // TODO: Replace Promise.resolve() with update metadata in wallet.rs when api is exposed
        await Promise.resolve()
        updateAccountMetadataOnActiveProfile(get(selectedAccount)?.id, metadata)
        updateSelectedAccount(metadata)
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
