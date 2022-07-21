import { selectedAccount } from '@core/account'
import { get } from 'svelte/store'
import { addNativeTokenAsset, clearNativeTokenAssets } from '../stores'
import { getTokenDataFromFoundryOutput } from '../utils'

export async function refreshNativeTokens(): Promise<void> {
    clearNativeTokenAssets()
    for (const nativeToken of get(selectedAccount)?.balances?.nativeTokens) {
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
