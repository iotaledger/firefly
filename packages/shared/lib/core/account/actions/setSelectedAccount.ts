import { selectedAccount, selectedAccountId } from '../stores'
import { BASE_TOKEN, COIN_TYPE } from '@core/network'
import { activeAccounts, activeProfile, updateActiveProfile } from '@core/profile'
import { addNativeToken, clearNativeTokens, setBaseCoin } from '@core/wallet'
import { get } from 'svelte/store'

export function setSelectedAccount(id: string): void {
    const account = get(activeAccounts)?.find((_account) => _account.id === id)
    if (account) {
        selectedAccountId.set(id)
        selectedAccount.set(account)
        setBaseCoin({
            id: COIN_TYPE[get(activeProfile)?.networkProtocol].toString(),
            metadata: BASE_TOKEN[get(activeProfile)?.networkProtocol],
            balance: {
                total: Number(account?.balances.total),
                available: Number(account?.balances.available),
            },
        })
        clearNativeTokens()
        account?.balances?.nativeTokens?.forEach((nativeToken) => {
            addNativeToken({
                id: nativeToken.id,
                balance: {
                    total: Number(nativeToken.amount),
                    available: Number(nativeToken.amount),
                },
            })
        })
        updateActiveProfile({ lastUsedAccountId: id })
    } else {
        throw new Error(`Account with ID ${id} cannot be found!`)
    }
}
