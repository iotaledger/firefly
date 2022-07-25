import { getBalance } from '../api/getBalance'
import { selectedAccount, updateSelectedAccount } from '../stores'
import { updateActiveAccount } from '@core/profile'
import { get } from 'svelte/store'
import { refreshAccountAssetsForActiveProfile } from '@core/wallet/actions/refreshAccountAssetsForActiveProfile'

export async function syncBalance(accountId: string): Promise<void> {
    const balances = await getBalance(accountId)
    if (get(selectedAccount)?.id === accountId) {
        updateSelectedAccount({ balances })
    } else {
        updateActiveAccount(accountId, { balances })
    }
    refreshAccountAssetsForActiveProfile(true)
    return
}
