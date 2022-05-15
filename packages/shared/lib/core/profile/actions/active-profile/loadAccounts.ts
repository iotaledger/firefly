import { buildAccountState, IAccountState } from '@core/account'
import { activeProfile, getAccountMetadatById } from '@core/profile'
import { getAccounts } from '@core/profile-manager'
import { get } from 'svelte/store'

export async function loadAccounts(): Promise<void> {
    try {
        const { hasLoadedAccounts, accounts } = get(activeProfile)
        const accountsResponse = await getAccounts()
        if (accountsResponse.length === 0) {
            hasLoadedAccounts.set(true)
            return
        }
        if (accountsResponse) {
            const laodedAccounts: IAccountState[] = []
            for (const account of accountsResponse) {
                // await account.sync()
                const metadata = getAccountMetadatById(account?.meta?.index.toString())
                const accountState = await buildAccountState(account, metadata)
                laodedAccounts.push(accountState)
            }
            accounts.update((_accounts) => laodedAccounts.sort((a, b) => a.meta.index - b.meta.index))
            hasLoadedAccounts.set(true)
        }
    } catch (err) {
        console.error(err)
    }
}
