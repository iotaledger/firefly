import { selectedAccount } from '@core/account/stores'
import { MarketCoinPrices } from '@core/market'
import { NetworkId } from '@core/network'
import { network } from '@core/network/stores'
import { getCoinType } from '@core/profile'
import { isValidIrc30 } from '@core/token'
import { get } from 'svelte/store'
import { IAsset } from '../interfaces'
import { AccountAssets, IAccountAssetsPerNetwork } from '../interfaces/account-assets.interface'
import { getAssetFromPersistedAssets } from '../utils'
import { sortAssets } from '../utils/sortAssets'
import { getActiveNetworkId } from '@core/network/utils/getNetworkId'

export function getAccountAssetsForSelectedAccount(marketCoinPrices: MarketCoinPrices): AccountAssets {
    const accountAssets = {} as AccountAssets

    const networkId = getActiveNetworkId()
    if (!networkId) {
        return {}
    }

    accountAssets[networkId] = getAccountAssetForNetwork(marketCoinPrices, networkId)
    const chains = get(network)?.getChains() ?? []

    for (const chain of chains) {
        const chainId = chain.getConfiguration().chainId
        const chainAssets = getAccountAssetForChain()
        accountAssets[chainId] = chainAssets
    }

    return accountAssets
}

function getAccountAssetForNetwork(marketCoinPrices: MarketCoinPrices, networkId: NetworkId): IAccountAssetsPerNetwork {
    const account = get(selectedAccount)

    const shouldCalculateFiatPrice = networkId === NetworkId.Shimmer || networkId === NetworkId.Testnet
    const persistedBaseCoin = getAssetFromPersistedAssets(getCoinType())
    const baseCoin: IAsset = {
        ...persistedBaseCoin,
        balance: {
            total: Number(account?.balances?.baseCoin?.total),
            available: Number(account?.balances?.baseCoin?.available),
        },
        ...(shouldCalculateFiatPrice && { marketPrices: marketCoinPrices?.shimmer }),
    }

    const nativeTokens: IAsset[] = []
    const tokens = account?.balances?.nativeTokens ?? []
    for (const token of tokens) {
        const persistedAsset = getAssetFromPersistedAssets(token.tokenId)
        if (persistedAsset && persistedAsset?.metadata && isValidIrc30(persistedAsset.metadata)) {
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

function getAccountAssetForChain(): IAccountAssetsPerNetwork {
    return {
        baseCoin: undefined,
        nativeTokens: [],
    }
}
