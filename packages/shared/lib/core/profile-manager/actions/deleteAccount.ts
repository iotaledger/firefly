import { removeAccountFromActiveAccounts, visibleActiveAccounts } from '@core/profile'
import { CannotRemoveAccountError, removeLatestAccount, RemoveNotLastAccountError } from '@core/profile-manager'
import { get } from 'svelte/store'

export async function deleteAccount(index: number): Promise<void> {
    const accountToBeDeleted = get(visibleActiveAccounts).find((account) => account?.index === index)
    const accounts = get(visibleActiveAccounts)

    if (accountToBeDeleted !== accounts[accounts.length - 1]) {
        throw new RemoveNotLastAccountError()
    }

    try {
        await removeLatestAccount()
        removeAccountFromActiveAccounts(index)
    } catch (err) {
        throw new CannotRemoveAccountError()
    }
}
