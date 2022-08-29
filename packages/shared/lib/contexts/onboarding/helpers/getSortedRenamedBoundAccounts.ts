import { Writable } from 'svelte/store'

import { AccountMeta } from '@iota/wallet'

import { getBoundAccount, IAccount } from '@core/account'
import { localize } from '@core/i18n'
import { IProfileManager, profileManager as _profileManager } from '@core/profile-manager'
import { sortAccountsByIndex } from '@core/utils'

export async function getSortedRenamedBoundAccounts(
    accountMetadataList: AccountMeta[],
    profileManager: Writable<IProfileManager> = _profileManager
): Promise<IAccount[]> {
    return (
        await Promise.all(
            accountMetadataList.map(async (accountMetadata) => {
                const account = await getBoundAccount(accountMetadata?.index, true, profileManager)
                account.meta.alias = Number.isNaN(accountMetadata?.alias)
                    ? accountMetadata?.alias
                    : `${localize('general.account')} ${accountMetadata?.index + 1}`
                return account
            })
        )
    ).sort(sortAccountsByIndex)
}
