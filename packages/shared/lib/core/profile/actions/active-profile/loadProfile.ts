import { setSelectedAccount } from '@core/account'
import { loadAllAccountActivities } from '@core/wallet/actions/loadAllAccountActivities'
import { refreshAccountAssetsForActiveProfile } from '@core/wallet/actions/refreshAccountAssetsForActiveProfile'
import { get } from 'svelte/store'
import { activeAccounts, activeProfile } from '../../stores'
import { loadAccounts } from './loadAccounts'

export async function loadProfile(): Promise<void> {
    try {
        const { lastUsedAccountId } = get(activeProfile)
        await loadAccounts()
        setSelectedAccount(lastUsedAccountId ?? get(activeAccounts)?.[0]?.id ?? null)
        await refreshAccountAssetsForActiveProfile()
        await loadAllAccountActivities()
    } catch (err) {
        console.error(err)
    }
}
