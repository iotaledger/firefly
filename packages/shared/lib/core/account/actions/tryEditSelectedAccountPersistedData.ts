import { showAppNotification } from '@auxiliary/notification'
import { localize } from '@core/i18n'
import { displayNotificationForLedgerProfile } from '@core/ledger'
import { isActiveLedgerProfile, updateActiveAccountPersistedData } from '@core/profile'
import { get } from 'svelte/store'
import { IPersistedAccountData } from '../interfaces'
import { selectedAccount, updateSelectedAccount } from '../stores'

export async function tryEditSelectedAccountPersistedData(
    partialAccountPersistedData: Partial<IPersistedAccountData>
): Promise<void> {
    try {
        // TODO: Replace Promise.resolve() with update metadata in wallet.rs when api is exposed
        await Promise.resolve()
        const _selectedAccount = get(selectedAccount)
        if (_selectedAccount) {
            updateActiveAccountPersistedData(_selectedAccount.index, partialAccountPersistedData)
        }
        updateSelectedAccount(partialAccountPersistedData)
    } catch (err) {
        if (err) {
            console.error(err?.error || err)
            if (get(isActiveLedgerProfile)) {
                displayNotificationForLedgerProfile('error', true, false, err)
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
