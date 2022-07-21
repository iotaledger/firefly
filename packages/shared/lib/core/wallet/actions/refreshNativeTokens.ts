import { activeAccounts } from '@core/profile'
import { get } from 'svelte/store'
import { addNativeTokenAsset, clearNativeTokenAssets } from '../stores'
import { getTokenDataFromFoundryOutput } from '../utils'

export async function refreshNativeTokens(): Promise<void> {
    clearNativeTokenAssets()
    const account = get(activeAccounts).find((_account) => _account.id === accountId)
    for (const nativeToken of account?.balances?.nativeTokens) {
        const metadata = await getTokenDataFromFoundryOutput(nativeToken.tokenId)
        addNativeTokenAsset({
            id: nativeToken.tokenId,
            metadata,
            balance: {
                total: Number(nativeToken.total),
                available: Number(nativeToken.available),
            },
        })
    }
}
