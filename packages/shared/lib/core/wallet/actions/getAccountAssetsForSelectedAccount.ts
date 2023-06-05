import { getSelectedAccount } from '@core/account/stores'
import { MarketCoinPrices } from '@core/market'
import { getActiveNetworkId } from '@core/network/utils/getNetworkId'
import { ChainId, NetworkId, getNetwork } from '@core/network'
import { getCoinType } from '@core/profile'
import { isValidIrc30, isValidToken } from '@core/token'
import { IAsset } from '../interfaces'
import { AccountAssets, IAccountAssetsPerNetwork } from '../interfaces/account-assets.interface'
import { getAssetFromPersistedAssets } from '../utils'
import { sortAssets } from '../utils/sortAssets'
import { getLayer2AccountBalance } from '@core/layer-2/stores'

export function getAccountAssetsForSelectedAccount(marketCoinPrices: MarketCoinPrices): AccountAssets {
    const accountAssets = {} as AccountAssets

    const networkId = getActiveNetworkId()
    if (!networkId) {
        return {}
    }

    accountAssets[networkId] = getAccountAssetForNetwork(marketCoinPrices, networkId)
    const chains = getNetwork()?.getChains() ?? []

    for (const chain of chains) {
        const chainId = chain.getConfiguration().chainId
        const chainAssets = getAccountAssetForChain(chainId)
        if (chainAssets) {
            accountAssets[chainId] = chainAssets
        }
    }

    return accountAssets
}

function getAccountAssetForNetwork(marketCoinPrices: MarketCoinPrices, networkId: NetworkId): IAccountAssetsPerNetwork {
    const account = getSelectedAccount()

    const shouldCalculateFiatPrice = networkId === NetworkId.Shimmer || networkId === NetworkId.Testnet
    const persistedBaseCoin = getAssetFromPersistedAssets(getCoinType())
    const baseCoin: IAsset = {
        ...persistedBaseCoin,
        chainId: ChainId.Layer1,
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
                chainId: ChainId.Layer1,
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

function getAccountAssetForChain(chainId: number): IAccountAssetsPerNetwork | undefined {
    const index = getSelectedAccount()?.index
    const balanceForChainId = index !== undefined ? getLayer2AccountBalance(index)?.[chainId] : undefined

    if (!balanceForChainId) {
        return undefined
    }

    let baseCoin: IAsset | undefined
    const nativeTokens: IAsset[] = []
    const tokens = Object.entries(balanceForChainId) ?? []

    for (const [tokenId, balance] of tokens) {
        const _balance = {
            total: balance,
            available: balance,
        }

        if (tokenId === '0x') {
            const persistedBaseCoin = getAssetFromPersistedAssets(getCoinType()) // we use the L1 coin type for now because we assume that the basecoin for L2 is SMR
            baseCoin = {
                ...persistedBaseCoin,
                balance: _balance,
                chainId,
            }
        } else {
            const persistedAsset = getAssetFromPersistedAssets(tokenId)
            if (persistedAsset && persistedAsset?.metadata && isValidToken(persistedAsset.metadata)) {
                nativeTokens.push({
                    ...persistedAsset,
                    balance: _balance,
                    chainId,
                })
            }
        }
    }

    return {
        baseCoin,
        nativeTokens: sortAssets(nativeTokens),
    }
}
