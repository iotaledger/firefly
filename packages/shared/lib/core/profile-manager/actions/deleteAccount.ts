import { get } from 'svelte/store'
import { setSelectedAccount } from '@core/account'
import { removeAccountFromActiveAccounts, visibleActiveAccounts } from '@core/profile'
import {
    CannotRemoveAccountError,
    RemoveAccountWithBalanceError,
    removeLatestAccount,
    RemoveNotLastAccountError,
} from '@core/profile-manager'
import { resetWalletRoute } from '@core/router'
import { parseCurrency } from '@lib/currency'

export async function deleteAccount(id: string): Promise<void> {
    const accountToBeDeleted = get(visibleActiveAccounts).find((account) => account?.id === id)
    const accounts = get(visibleActiveAccounts)

    if (accountToBeDeleted !== accounts[accounts.length - 1]) {
        throw new RemoveNotLastAccountError()
    }

    if (parseCurrency(accountToBeDeleted?.balances?.baseCoin?.total) > 0) {
        throw new RemoveAccountWithBalanceError()
    }

    try {
        await removeLatestAccount()
        removeAccountFromActiveAccounts(id)
        setSelectedAccount(get(visibleActiveAccounts)?.[0]?.id ?? null)
        resetWalletRoute()
    } catch (err) {
        throw new CannotRemoveAccountError()
    }
}
