import { selectedAccount } from '@core/account'
import { get } from 'svelte/store'
import { addNativeTokenAsset, clearNativeTokenAssets } from '../stores'
import { getTokenMetadataFromFoundryOutput } from '../utils'

export async function refreshNativeTokens(): Promise<void> {
    clearNativeTokenAssets()
    for (const nativeToken of get(selectedAccount)?.balances?.nativeTokens) {
        const metadata = await getTokenMetadataFromFoundryOutput(nativeToken.tokenId)
        if (metadata) {
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
}
