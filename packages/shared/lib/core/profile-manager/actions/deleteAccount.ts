import { get } from 'svelte/store'

import { setSelectedAccount } from '@core/account'
import { removeAccountFromActiveAccounts, visibleActiveAccounts } from '@core/profile'
import { CannotRemoveAccountError, removeLatestAccount } from '@core/profile-manager'
import { resetWalletRoute } from '@core/router'

export async function deleteAccount(id: string): Promise<void> {
    try {
        await removeLatestAccount()
        removeAccountFromActiveAccounts(id)

        setSelectedAccount(get(visibleActiveAccounts)?.[0]?.id ?? null)
        resetWalletRoute()
    } catch (err) {
        throw new CannotRemoveAccountError()
    }
}
