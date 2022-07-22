import { BASE_TOKEN, COIN_TYPE } from '@core/network'
import { activeAccounts, activeProfile, updateActiveProfile } from '@core/profile'
import { setBaseCoinAsset, TokenVerificationStatus } from '@core/wallet'
import { refreshNativeTokens } from '@core/wallet/actions/refreshNativeTokens'
import { get } from 'svelte/store'
import { selectedAccount, selectedAccountId } from '../stores'

export function setSelectedAccount(id: string): void {
    const account = get(activeAccounts)?.find((_account) => _account.id === id)
    if (account) {
        selectedAccountId.set(id)
        selectedAccount.set(account)
        updateActiveProfile({ lastUsedAccountId: id })
        setBaseCoinAsset({
            id: COIN_TYPE[get(activeProfile)?.networkProtocol].toString(),
            metadata: {
                ...BASE_TOKEN[get(activeProfile)?.networkProtocol],
                verification: TokenVerificationStatus.Verified,
            },
            balance: {
                total: Number(account?.balances?.baseCoin?.total),
                available: Number(account?.balances?.baseCoin?.available),
            },
        })
        refreshNativeTokens()
    } else {
        throw new Error(`Account with ID ${id} cannot be found!`)
    }
}
