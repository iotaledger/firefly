import { getBalance } from '../api/getBalance'
import { selectedAccount, updateSelectedAccount } from '../stores'
import { updateActiveAccount } from '@core/profile'
import { get } from 'svelte/store'
import { refreshNativeTokens } from '@core/wallet/actions/refreshNativeTokens'
import { updateBaseCoin } from '@core/wallet'

export async function syncBalance(accountId: string): Promise<void> {
    const balances = await getBalance(accountId)
    if (get(selectedAccount)?.id === accountId) {
        updateSelectedAccount({ balances })
        updateBaseCoin({ balance: { total: Number(balances.total), available: Number(balances.available) } })
        refreshNativeTokens()
    } else {
        updateActiveAccount(accountId, { balances })
    }

    return
}
