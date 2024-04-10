import { MarketCoinPrices } from '@core/market'
import { PERSISTED_MANA_ASSET, NetworkId, getManaBalance } from '@core/network'
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
            total: Number(wallet?.balances?.baseCoin?.total ?? 0),
            available: Number(wallet?.balances?.baseCoin?.available ?? 0),
        },
        ...(shouldCalculateFiatPrice && { marketPrices: marketCoinPrices?.[marketCoinId] }),
    }

    const mana: IAsset = {
        ...PERSISTED_MANA_ASSET,
        balance: {
            total: getManaBalance(wallet?.balances?.mana?.total),
            available: wallet?.balances?.realAvailableMana,
        },
    }

    const nativeTokens: IAsset[] = []
    const tokens = wallet?.balances?.nativeTokens ?? {}
    for (const [tokenId, token] of Object.entries(tokens)) {
        const persistedAsset = getAssetFromPersistedAssets(tokenId)
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
        mana,
        nativeTokens: sortAssets(nativeTokens),
    }
}
