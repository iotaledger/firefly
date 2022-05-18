import { localize } from '@core/i18n'
import { COIN_TYPE } from '@core/network'
import { activeProfile, addAccountMetadataToActiveProfile, addAccountToActiveProfile } from '@core/profile'
import { createStardustAccount, getAccount } from '@core/profile-manager'
import { get } from 'svelte/store'
import { IAccountState } from '../interfaces'
import { buildAccountStateAndMetadata } from './buildAccountStateAndMetadata'

export async function createNewAccount(name?: string, color?: string): Promise<IAccountState> {
    const { accounts, networkProtocol } = get(activeProfile)
    try {
        const createdAccount = await createStardustAccount({
            alias: name || `${localize('general.account')} ${(get(accounts)?.length ?? 0) + 1}`,
            coinType: COIN_TYPE[networkProtocol],
        })
        const account = await getAccount(createdAccount.meta.index)
        account.sync()
        const [newAccount, metadata] = await buildAccountStateAndMetadata(account, color)
        addAccountToActiveProfile(newAccount)
        addAccountMetadataToActiveProfile(metadata)
        return newAccount
    } catch (err) {
        console.error(err)
    }
}
