import { activeAccounts, activeProfile } from '@core/profile'
import { get } from 'svelte/store'
import { selectedAccount, selectedAccountId } from '../stores'

export function setSelectedAccount(id: string): void {
    const account = get(activeAccounts)?.find((_account) => _account.id === id)
    if (account) {
        selectedAccountId.set(id)
        selectedAccount.set(account)
    } else {
        throw new Error(`Account with ID ${id} cannot be found!`)
    }
}
