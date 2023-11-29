import { Writable } from 'svelte/store'

import { getBoundAccount, IAccount } from '@core/account'
import { localize } from '@core/i18n'
import { IProfileManager, profileManager as _profileManager } from '@core/profile-manager'
import { sortAccountsByIndex } from '@core/utils'

// TODO(2.0) Fix this, account indexes are gone
export async function getSortedRenamedBoundAccounts(
    accounts: IAccount[],
    profileManager: Writable<IProfileManager> = _profileManager
): Promise<IAccount[]> {
    return (
        await Promise.all(
            accounts.map(async (account) => {
                const { index, alias } = account?.getMetadata() ?? {}
                const boundAccount = await getBoundAccount(index, true, profileManager)
                const boundAccountAlias = Number.isNaN(alias) ? alias : `${localize('general.account')} ${index + 1}`
                await boundAccount.setAlias(boundAccountAlias)
                return boundAccount
            })
        )
    ).sort(sortAccountsByIndex)
}
