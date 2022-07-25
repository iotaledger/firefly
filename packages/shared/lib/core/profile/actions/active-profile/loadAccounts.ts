import { IAccountState, loadAccount, setSelectedAccount } from '@core/account'
import { getAccounts } from '@core/profile-manager'
import { loadAccountActivities } from '@core/wallet'
import { refreshAccountAssetsForActiveProfile } from '@core/wallet/actions/refreshAccountAssetsForActiveProfile'
import { get } from 'svelte/store'
import { activeAccounts, activeProfile } from '../../stores'

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
            // optimize this so that we can load all account async and parallelise
            for (const account of accountsResponse) {
                const accountState = await loadAccount(account)
                loadedAccounts.push(accountState)
            }
            activeAccounts.set(loadedAccounts.sort((a, b) => a.meta.index - b.meta.index))
            setSelectedAccount(lastUsedAccountId ?? get(activeAccounts)?.[0]?.id ?? null)
            await refreshAccountAssetsForActiveProfile(true)
            for (const accountState of get(activeAccounts)) {
                await loadAccountActivities(accountState)
            }
            hasLoadedAccounts.set(true)
        }
    } catch (err) {
        console.error(err)
    }
}
