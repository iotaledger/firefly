import { get } from 'svelte/store'

import { setSelectedAccount } from '@core/account/actions'
import { AppContext } from '@core/app/enums'
import { Platform } from '@core/app/classes'
import { removeAccountFromActiveAccounts, visibleActiveAccounts } from '@core/profile/stores'
import { CannotRemoveAccountError, RemoveNotLastAccountError } from '@core/profile-manager/errors'
import { removeLatestAccount } from '@core/profile-manager/api'

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
        Platform.resetRouterForAppContext(AppContext.Dashboard)
    } catch (err) {
        throw new CannotRemoveAccountError()
    }
}
