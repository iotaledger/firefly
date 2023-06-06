import { selectedAccount } from '@core/account'
import { updateActiveAccountPersistedData } from '@core/profile'
import { updateActiveAccount } from '@core/profile/stores'
import { get } from 'svelte/store'

export function updateActiveAccountTrackedTokens(tokenAddress: string, chainId: number): void {
    const account = get(selectedAccount)
    if (!account) {
        return
    }

    let trackedTokens = account.trackedTokens ?? {}
    const chainIdTrackedTokens = trackedTokens[chainId] ?? []
    if (!chainIdTrackedTokens.includes(tokenAddress)) {
        chainIdTrackedTokens.push(tokenAddress)
        trackedTokens = { ...trackedTokens, [chainId]: chainIdTrackedTokens }

        updateActiveAccount(account.index, { trackedTokens })
        updateActiveAccountPersistedData(account.index, { trackedTokens })
    }
}
