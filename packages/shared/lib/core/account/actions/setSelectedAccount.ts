import { activeProfile } from '@core/profile'
import { get } from 'svelte/store'
import { selectedAccount, selectedAccountId } from '../stores'

export function setSelectedAccount(id: string): void {
    const { accounts } = get(activeProfile)
    const account = get(accounts)?.find((_account) => _account.id === id)
    if (account) {
        selectedAccountId.set(id)
        selectedAccount.set(account)
    } else {
        throw new Error(`Account with ID ${id} cannot be found!`)
    }
}
