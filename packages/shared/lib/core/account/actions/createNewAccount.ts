import { get } from 'svelte/store'

import { localize } from '@core/i18n'
import { activeAccounts, addAccountMetadataToActiveProfile, addAccountToActiveAccounts } from '@core/profile'
import { createStardustAccount, getAccount } from '@core/profile-manager'

import { IAccountState } from '../interfaces'
import { buildAccountStateAndMetadata } from './buildAccountStateAndMetadata'
import { addEmptyAccountActivitiesToAllAccountActivities } from '@core/wallet/stores/all-account-activities.store'

export async function createNewAccount(name?: string, color?: string): Promise<IAccountState> {
    try {
        const createdAccount = await createStardustAccount({
            alias: name || `${localize('general.account')} ${(get(activeAccounts)?.length ?? 0) + 1}`,
        })

        const account = await getAccount(createdAccount.meta.index)
        await account.sync()

        const [newAccount, metadata] = await buildAccountStateAndMetadata(account, name, color)
        addAccountToActiveAccounts(newAccount)
        addAccountMetadataToActiveProfile(metadata)
        addEmptyAccountActivitiesToAllAccountActivities(`${createdAccount.meta.index}`)

        return newAccount
    } catch (err) {
        console.error(err)
        throw err
    }
}
