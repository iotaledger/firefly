import { localize } from '@core/i18n'
import { activeAccounts, addAccountPersistedDataToActiveProfile, addAccountToActiveAccounts } from '@core/profile'
import { createAccount } from '@core/profile-manager'
import { addEmptyAccountActivitiesToAllAccountActivities } from '@core/wallet/stores'
import { get } from 'svelte/store'

import { DEFAULT_SYNC_OPTIONS } from '../constants'
import { IAccountState } from '../interfaces'

import { buildAccountStateAndPersistedData } from './buildAccountStateAndPersistedData'

export async function createNewAccount(name?: string, color?: string): Promise<IAccountState> {
    const account = await createAccount({
        alias: name || `${localize('general.account')} ${(get(activeAccounts)?.length ?? 0) + 1}`,
    })

    await account.sync(DEFAULT_SYNC_OPTIONS)

    const [accountIndex, newAccount, accountPersistedData] = await buildAccountStateAndPersistedData(
        account,
        name,
        color
    )
    addAccountToActiveAccounts(newAccount)
    addAccountPersistedDataToActiveProfile(accountIndex, accountPersistedData)
    addEmptyAccountActivitiesToAllAccountActivities(accountIndex)

    return newAccount
}
