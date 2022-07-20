import { getBalance } from '../api/getBalance'
import { selectedAccount, updateSelectedAccount } from '../stores'
import { updateActiveAccount } from '@core/profile'
import { get } from 'svelte/store'
import { refreshNativeTokens } from '@core/wallet/actions/refreshNativeTokens'
import { updateBaseCoinAsset } from '@core/wallet'

export async function syncBalance(accountId: string): Promise<void> {
    const balances = await getBalance(accountId)
    if (get(selectedAccount)?.id === accountId) {
        updateSelectedAccount({ balances })
        updateBaseCoinAsset({
            balance: { total: Number(balances?.baseCoin?.total), available: Number(balances?.baseCoin?.available) },
        })
        refreshNativeTokens()
    } else {
        updateActiveAccount(accountId, { balances })
    }

    return
}
