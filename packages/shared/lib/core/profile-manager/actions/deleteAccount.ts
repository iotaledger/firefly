import { get } from 'svelte/store'

import { setSelectedAccount } from '@core/account/actions'
import { AppContext } from '@core/app/enums'
import { removeAccountFromActiveAccounts, visibleActiveAccounts } from '@core/profile/stores'
import { CannotRemoveAccountError, RemoveNotLastAccountError } from '@core/profile-manager/errors'
import { removeLatestAccount } from '@core/profile-manager/api'
import { routerManager } from '@core/router/stores'
import { handleError } from '@core/error/handlers'

export async function deleteAccount(index: number): Promise<void> {
    const accountToBeDeleted = get(visibleActiveAccounts).find((account) => account?.index === index)
    const accounts = get(visibleActiveAccounts)

    if (accounts.length === 1) {
        throw new CannotRemoveAccountError()
    }

    if (accountToBeDeleted !== accounts[accounts.length - 1]) {
        throw new RemoveNotLastAccountError()
    }

    try {
        await removeLatestAccount()
        removeAccountFromActiveAccounts(index)
        try {
            setSelectedAccount(get(visibleActiveAccounts)?.[0]?.index ?? null)
            get(routerManager).resetRouterForAppContext(AppContext.Dashboard)
        } catch (err) {
            handleError(err)
        }
    } catch (err) {
        throw new CannotRemoveAccountError()
    }
}
