import { get } from 'svelte/store'

import { localize } from '@core/i18n'
import { activeAccounts, addAccountMetadataToActiveProfile, addAccountToActiveAccounts } from '@core/profile'
import { createAccount } from '@core/profile-manager'

import { IAccountState } from '../interfaces'
import { buildAccountStateAndMetadata } from './buildAccountStateAndMetadata'
import { addEmptyAccountActivitiesToAllAccountActivities } from '@core/wallet/stores/all-account-activities.store'

export async function createNewAccount(name?: string, color?: string): Promise<IAccountState> {
    const account = await createAccount({
        alias: name || `${localize('general.account')} ${(get(activeAccounts)?.length ?? 0) + 1}`,
    })

    await account.sync({ syncIncomingTransactions: true })

    const [newAccount, metadata] = await buildAccountStateAndMetadata(account, name, color)
    addAccountToActiveAccounts(newAccount)
    addAccountMetadataToActiveProfile(metadata)
    addEmptyAccountActivitiesToAllAccountActivities(`${account.getMetadata().index}`)

    return newAccount
}
