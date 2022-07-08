import { selectedAccount } from '@core/account'
import { get } from 'svelte/store'
import { addNativeToken, clearNativeTokens } from '../stores'

export function refreshNativeTokens(): void {
    clearNativeTokens()
    get(selectedAccount)?.balances?.nativeTokens?.forEach((nativeToken) => {
        addNativeToken({
            id: nativeToken.id,
            balance: {
                total: Number(nativeToken.amount),
                available: Number(nativeToken.amount),
            },
        })
    })
}
