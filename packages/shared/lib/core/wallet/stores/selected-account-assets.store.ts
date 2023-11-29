import { selectedAccount } from '@core/account/stores/selected-account.store'
import { marketCoinPrices } from '@core/market'
import { activeProfileId } from '@core/profile'
import { derived, get, Readable, writable, Writable } from 'svelte/store'
import { getWalletAssetsForSelectedAccount } from '../actions/getWalletAssetsForSelectedAccount'
import { DEFAULT_ASSET_FILTER } from '../constants'
import { AssetFilter, IAsset } from '../interfaces'
import { WalletAssets } from '../interfaces/wallet-assets.interface'
import { persistedAssets } from './persisted-assets.store'

export const assetFilter: Writable<AssetFilter> = writable(DEFAULT_ASSET_FILTER)

export const selectedAccountAssets: Readable<WalletAssets> = derived(
    [activeProfileId, marketCoinPrices, selectedAccount, persistedAssets, assetFilter],
    ([$activeProfileId, $marketCoinPrices]) => {
        if ($activeProfileId) {
            return getWalletAssetsForSelectedAccount($marketCoinPrices)
        } else {
            return {}
        }
    }
)

export const visibleSelectedAccountAssets: Readable<WalletAssets> = derived(
    [selectedAccountAssets],
    ([$selectedAccountAssets]) => {
        const visibleAssets: WalletAssets = {}
        for (const networkId of Object.keys($selectedAccountAssets)) {
            const visible = {
                baseCoin: $selectedAccountAssets[networkId].baseCoin,
                nativeTokens: $selectedAccountAssets[networkId].nativeTokens.filter((asset) => !asset.hidden),
            }
            visibleAssets[networkId] = visible
        }
        return visibleAssets
    }
)

export function getAssetById(assetId: string, networkId: string | number): IAsset | undefined {
    const assets = get(selectedAccountAssets)[networkId]
    const { baseCoin, nativeTokens } = assets ?? {}
    if (assetId === baseCoin?.id) {
        return baseCoin
    } else {
        return nativeTokens?.find((token) => token.id === assetId)
    }
}
