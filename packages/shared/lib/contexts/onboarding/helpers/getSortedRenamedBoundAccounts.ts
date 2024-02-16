import { Writable } from 'svelte/store'

import { localize } from '@core/i18n'
import { sortAccountsByIndex } from '@core/utils'
import { IWallet } from '@core/profile'

// TODO(2.0) Fix this, account indexes are gone
export async function getSortedRenamedBoundAccounts(
    wallets: IWallet[],
    profileManager: Writable<IProfileManager> = _profileManager
): Promise<IAccount[]> {
    return (
        await Promise.all(
            accounts.map(async (account) => {
                const { index, alias } = account?.getMetadata() ?? {}
                const boundAccount = await getBoundAccount(index, true, profileManager)
                const boundAccountAlias = Number.isNaN(alias) ? alias : `${localize('general.wallet')} ${index + 1}`
                await boundAccount.setAlias(boundAccountAlias)
                return boundAccount
            })
        )
    ).sort(sortAccountsByIndex)
}
