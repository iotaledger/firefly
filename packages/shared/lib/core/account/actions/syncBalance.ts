import { getBalance } from '../api/getBalance'
import { selectedAccount, updateSelectedAccount } from '../stores'
import { updateActiveAccount } from '@core/profile'
import { get } from 'svelte/store'
import { refreshAccountAssetsForActiveProfile } from '@core/wallet/actions/refreshAccountAssetsForActiveProfile'

export async function syncBalance(accountIndex: number): Promise<void> {
    const balances = await getBalance(accountIndex)
    if (get(selectedAccount)?.index === accountIndex) {
        updateSelectedAccount({ balances })
    } else {
        updateActiveAccount(accountIndex, { balances })
    }
    refreshAccountAssetsForActiveProfile()
    return
}
