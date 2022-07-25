import { get } from 'svelte/store'
import { addBaseCoinAndNativeTokens } from '../stores'
import { getTokenMetadataFromFoundryOutput } from '../utils'
import { BASE_TOKEN, COIN_TYPE } from '@core/network'
import { activeAccounts, activeProfile } from '@core/profile'

export async function loadBaseCoinAndNativeTokens(accountId: string): Promise<void> {
    const account = get(activeAccounts).find((_account) => _account.id === accountId)
    const networkProtocol = get(activeProfile)?.networkProtocol

    const baseCoin = {
        id: COIN_TYPE[networkProtocol].toString(),
        metadata: BASE_TOKEN[networkProtocol],
        balance: {
            total: Number(account?.balances?.baseCoin?.total),
            available: Number(account?.balances?.baseCoin?.available),
        },
    }
    const nativeTokens = []
    const tokens = account?.balances?.nativeTokens ?? []
    for (const token of tokens) {
        const metadata = await getTokenMetadataFromFoundryOutput(token.tokenId)

        if (metadata) {
            nativeTokens.push({
                id: token.tokenId,
                metadata,
                balance: {
                    total: Number(token.total),
                    available: Number(token.available),
                },
            })
        }
    }
    addBaseCoinAndNativeTokens(baseCoin, nativeTokens, accountId)
}
