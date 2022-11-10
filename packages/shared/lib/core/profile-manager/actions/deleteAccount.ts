import { get } from 'svelte/store'

import { setSelectedAccount } from '@core/account/actions'
import { AppContext } from '@core/app/enums'
import { removeAccountFromActiveAccounts, visibleActiveAccounts } from '@core/profile/stores'
import { CannotRemoveAccountError, RemoveNotLastAccountError } from '@core/profile-manager/errors'
import { removeLatestAccount } from '@core/profile-manager/api'
import { routerManager } from '@core/router/stores'

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
        get(routerManager).resetRouterForAppContext(AppContext.Dashboard)
    } catch (err) {
        throw new CannotRemoveAccountError()
    }
}
