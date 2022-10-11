import { setSelectedAccount } from '@core/account'
import { removeAccountFromActiveAccounts, visibleActiveAccounts } from '@core/profile'
import { CannotRemoveAccountError, removeLatestAccount, RemoveNotLastAccountError } from '@core/profile-manager'
import { resetWalletRoute } from '@core/router'
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
        setSelectedAccount(get(visibleActiveAccounts)?.[0]?.index ?? null)
        resetWalletRoute()
    } catch (err) {
        throw new CannotRemoveAccountError()
    }
}
