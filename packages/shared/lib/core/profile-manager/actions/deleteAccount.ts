import { get } from 'svelte/store'

import { setSelectedAccount } from '@core/account/actions'
import { api } from '@core/api'
import { AppContext } from '@core/app/enums'
import { CannotRemoveAccountError, RemoveNotLastAccountError } from '@core/profile-manager/errors'
import { removeAccountFromActiveAccounts, visibleActiveAccounts } from '@core/profile/stores'
import { routerManager } from '@core/router/stores'

// TODO(2.0): replace all its usage, before it was numeric index, now it's id
export async function deleteAccount(id: string): Promise<void> {
    const accountToBeDeleted = get(visibleActiveAccounts).find((account) => account?.id === id)
    const accounts = get(visibleActiveAccounts)

    if (accountToBeDeleted !== accounts[accounts.length - 1]) {
        throw new RemoveNotLastAccountError()
    }

    try {
        await api.deleteWallet(id)
        removeAccountFromActiveAccounts(id)
        setSelectedAccount(get(visibleActiveAccounts)?.[0]?.index ?? null)
        get(routerManager).resetRouterForAppContext(AppContext.Dashboard)
    } catch (err) {
        throw new CannotRemoveAccountError()
    }
}
