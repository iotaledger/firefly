import { IAccount } from '@core/account'
import { api } from '@core/api'
import { activeProfile } from '@core/profile/stores'
import { get } from 'svelte/store'

// TODO(2.0): Fix all usages of this method
// TODO(2.0): Finalize when new profile is ready
export async function getAccounts(): Promise<IAccount[]> {
    const profile = get(activeProfile)
    let wallets: IAccount[] = []
    if (profile.accountPersistedData) {
        wallets = await Promise.all(Object.entries(profile.accountPersistedData)
            .map(([id, data]) => api.getAccount(id, data.walletOptions)))
    }
    return wallets
}
