import { selectedAccount } from '@core/account'
import { get } from 'svelte/store'
import { addNativeTokenAsset, clearNativeTokenAssets } from '../stores'

export function refreshNativeTokens(): void {
    clearNativeTokenAssets()
    get(selectedAccount)?.balances?.nativeTokens?.forEach((nativeToken) => {
        addNativeTokenAsset({
            id: nativeToken.id,
            balance: {
                total: Number(nativeToken.total),
                available: Number(nativeToken.available),
            },
        })
    })
}
