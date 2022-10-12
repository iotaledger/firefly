import { getBalance } from '../api/getBalance'
import { selectedAccount, updateSelectedAccount } from '../stores'
import { updateActiveAccount } from '@core/profile'
import { get } from 'svelte/store'

export async function syncBalance(accountIndex: number): Promise<void> {
    const balances = await getBalance(accountIndex)
    if (get(selectedAccount)?.index === accountIndex) {
        updateSelectedAccount({ balances })
    } else {
        updateActiveAccount(accountIndex, { balances })
    }
    return
}
