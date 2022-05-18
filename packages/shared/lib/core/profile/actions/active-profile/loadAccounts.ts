import { buildAccountState, IAccountState, setSelectedAccount } from '@core/account'
import { activeProfile, getAccountMetadataById } from '@core/profile'
import { getAccounts } from '@core/profile-manager'
import { get } from 'svelte/store'

export async function loadAccounts(): Promise<void> {
    try {
        const { hasLoadedAccounts, accounts, lastUsedAccountId } = get(activeProfile)
        const accountsResponse = await getAccounts()
        if (accountsResponse.length === 0) {
            hasLoadedAccounts.set(true)
            return
        }
        if (accountsResponse) {
            const loadedAccounts: IAccountState[] = []
            for (const account of accountsResponse) {
                await account.sync()
                const metadata = getAccountMetadataById(account?.meta?.index.toString())
                const accountState = await buildAccountState(account, metadata)
                loadedAccounts.push(accountState)
            }
            accounts.update((_accounts) => loadedAccounts.sort((a, b) => a.meta.index - b.meta.index))
            setSelectedAccount(lastUsedAccountId ?? get(accounts)?.[0]?.id ?? null)
            hasLoadedAccounts.set(true)
        }
    } catch (err) {
        console.error(err)
    }
}
