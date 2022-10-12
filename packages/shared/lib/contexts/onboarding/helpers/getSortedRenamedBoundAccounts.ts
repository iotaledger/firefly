import { Writable } from 'svelte/store'

import { getBoundAccount, IAccount } from '@core/account'
import { localize } from '@core/i18n'
import { IProfileManager, profileManager as _profileManager } from '@core/profile-manager'
import { sortAccountsByIndex } from '@core/utils'

export async function getSortedRenamedBoundAccounts(
    accounts: IAccount[],
    profileManager: Writable<IProfileManager> = _profileManager
): Promise<IAccount[]> {
    return (
        await Promise.all(
            accounts.map(async (account) => {
                const boundAccount = await getBoundAccount(account?.meta?.index, true, profileManager)
                boundAccount.meta.alias = Number.isNaN(account?.meta?.alias)
                    ? account?.meta?.alias
                    : `${localize('general.account')} ${account?.meta?.index + 1}`
                return boundAccount
            })
        )
    ).sort(sortAccountsByIndex)
}
