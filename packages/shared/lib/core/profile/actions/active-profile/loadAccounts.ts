import { activeAccounts, activeProfile, getAccountMetadataById } from '@core/profile'
import { buildAccountState, IAccountState, setSelectedAccount } from '@core/account'
import { getAccounts } from '@core/profile-manager'
import { get } from 'svelte/store'
import { loadAllAccountActivities } from '@core/wallet'

export async function loadAccounts(): Promise<void> {
    try {
        const { hasLoadedAccounts, lastUsedAccountId } = get(activeProfile)
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
            activeAccounts.set(loadedAccounts.sort((a, b) => a.meta.index - b.meta.index))
            setSelectedAccount(lastUsedAccountId ?? get(activeAccounts)?.[0]?.id ?? null)
            hasLoadedAccounts.set(true)
        }
        loadAllAccountActivities()
    } catch (err) {
        console.error(err)
    }
}
