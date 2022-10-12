import { selectedAccount, setSelectedAccount } from '@core/account'
import { nonHiddenActiveAccounts } from '@core/profile'
import { get } from 'svelte/store'

export function setNextSelectedAccount(): void {
    const account = get(selectedAccount)
    const otherAccounts = get(nonHiddenActiveAccounts)
    if (otherAccounts.length > 0) {
        if (account?.hidden) {
            const nextSelectedAccountIndex =
                otherAccounts[account?.index]?.index ?? otherAccounts[otherAccounts?.length - 1]?.index
            setSelectedAccount(nextSelectedAccountIndex)
        }
    } else {
        throw new Error('No accounts to select from')
    }
}
