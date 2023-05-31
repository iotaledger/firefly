import { selectedAccount, selectedAccountIndex } from '@core/account'
import { updateActiveAccountPersistedData } from '@core/profile'
import { updateActiveAccount } from '@core/profile/stores'
import { get } from 'svelte/store'

export function updateActiveAccountTrackedTokens(tokenAddress: string, chainId: number): void {
    let trackedTokens = get(selectedAccount)?.trackedTokens ?? {}
    const chainIdTrackedTokens = trackedTokens[chainId] ?? []
    if (!chainIdTrackedTokens.includes(tokenAddress)) {
        chainIdTrackedTokens.push(tokenAddress)
        trackedTokens = { ...trackedTokens, [chainId]: chainIdTrackedTokens }
        updateActiveAccount(get(selectedAccountIndex), { trackedTokens })
        updateActiveAccountPersistedData(get(selectedAccountIndex), { trackedTokens })
    }
}
