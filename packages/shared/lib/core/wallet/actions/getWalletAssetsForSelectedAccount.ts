import { MarketCoinPrices } from '@core/market'
import { NetworkId } from '@core/network'
import { getActiveNetworkId } from '@core/network/utils/getNetworkId'
import { getCoinType } from '@core/profile'
import { isValidIrc30Token } from '@core/token'
import { IAsset } from '../interfaces'
import { WalletAssets, IWalletAssetsPerNetwork } from '../interfaces'
import { getAssetFromPersistedAssets } from '../utils'
import { sortAssets } from '../utils/sortAssets'
import { getMarketCoinIdByNetworkId } from '@core/market/utils'
import { getSelectedWallet } from '../stores/selected-wallet.store'

export function getWalletAssetsForSelectedWallet(marketCoinPrices: MarketCoinPrices): WalletAssets {
    const walletAssets = {} as WalletAssets

    const networkId = getActiveNetworkId()
    if (!networkId) {
        return {}
    }

    walletAssets[networkId] = getWalletAssetForNetwork(marketCoinPrices, networkId)
    return walletAssets
}

function getWalletAssetForNetwork(marketCoinPrices: MarketCoinPrices, networkId: NetworkId): IWalletAssetsPerNetwork {
    const wallet = getSelectedWallet()

    const marketCoinId = getMarketCoinIdByNetworkId(networkId)
    const shouldCalculateFiatPrice = networkId !== NetworkId.Custom && marketCoinId
    const persistedBaseCoin = getAssetFromPersistedAssets(getCoinType())
    const baseCoin: IAsset = {
        ...persistedBaseCoin,
        balance: {
            total: Number(wallet?.balances?.baseCoin?.total),
            available: Number(wallet?.balances?.baseCoin?.available),
        },
        ...(shouldCalculateFiatPrice && { marketPrices: marketCoinPrices?.[marketCoinId] }),
    }

    const nativeTokens: IAsset[] = []
    const tokens = wallet?.balances?.nativeTokens ?? []
    for (const token of tokens) {
        const persistedAsset = getAssetFromPersistedAssets(token.tokenId)
        if (persistedAsset && persistedAsset?.metadata && isValidIrc30Token(persistedAsset.metadata)) {
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
