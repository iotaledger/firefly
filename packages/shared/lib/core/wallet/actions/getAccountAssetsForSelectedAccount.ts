import { selectedAccount } from '@core/account'
import { MarketCoinPrices } from '@core/market'
import { COIN_TYPE, NetworkProtocol } from '@core/network'
import { activeProfile } from '@core/profile'
import { isValidIrc30 } from '@core/token'
import { get } from 'svelte/store'
import { IAsset } from '../interfaces'
import { IAccountAssets } from '../interfaces/account-assets.interface'
import { getAssetFromPersistedAssets } from '../utils'
import { sortAssets } from '../utils/sortAssets'

export function getAccountAssetsForSelectedAccount(marketCoinPrices: MarketCoinPrices): IAccountAssets {
    const account = get(selectedAccount)
    const networkProtocol = get(activeProfile)?.networkProtocol

    const persistedBaseCoin = getAssetFromPersistedAssets(COIN_TYPE[networkProtocol].toString())
    const baseCoin: IAsset = {
        ...persistedBaseCoin,
        balance: {
            total: Number(account?.balances?.baseCoin?.total),
            available: Number(account?.balances?.baseCoin?.available),
        },
        ...(networkProtocol === NetworkProtocol.Shimmer && { marketPrices: marketCoinPrices?.shimmer }),
    }

    const nativeTokens: IAsset[] = []
    const tokens = account?.balances?.nativeTokens ?? []
    for (const token of tokens) {
        const persistedAsset = getAssetFromPersistedAssets(token.tokenId)
        if (persistedAsset && isValidIrc30(persistedAsset.metadata)) {
            nativeTokens.push({
                ...persistedAsset,
                balance: {
                    total: Number(token.total),
                    available: Number(token.available),
                },
            })
        }
    }

    return {
        baseCoin,
        nativeTokens: sortAssets(nativeTokens),
    }
}
