import { IAccountState, loadAccount, setSelectedAccount } from '@core/account'
import { getAccounts } from '@core/profile-manager'
import { loadAccountActivities } from '@core/wallet'
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
            // optimise this so that we can load all account async and parralellise
            for (const account of accountsResponse) {
                const accountState = await loadAccount(account)
                loadAccountActivities(accountState)
                loadedAccounts.push(accountState)
            }
            activeAccounts.set(loadedAccounts.sort((a, b) => a.meta.index - b.meta.index))
            setSelectedAccount(lastUsedAccountId ?? get(activeAccounts)?.[0]?.id ?? null)
            hasLoadedAccounts.set(true)
        }
    } catch (err) {
        console.error(err)
    }
}
