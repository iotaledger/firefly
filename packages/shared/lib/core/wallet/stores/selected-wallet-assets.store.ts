import { marketCoinPrices } from '@core/market'
import { activeProfileId } from '@core/profile/stores/active-profile-id.store'
import { derived, get, Readable, writable, Writable } from 'svelte/store'
import { DEFAULT_ASSET_FILTER } from '../constants'
import { AssetFilter, IAsset } from '../interfaces'
import { WalletAssets } from '../interfaces/wallet-assets.interface'
import { persistedAssets } from './persisted-assets.store'
import { selectedWallet } from './selected-wallet.store'
import { getWalletAssetsForSelectedWallet } from '../actions'

export const assetFilter: Writable<AssetFilter> = writable(DEFAULT_ASSET_FILTER)

export const selectedWalletAssets: Readable<WalletAssets> = derived(
    [activeProfileId, marketCoinPrices, selectedWallet, persistedAssets, assetFilter],
    ([$activeProfileId, $marketCoinPrices]) => {
        if ($activeProfileId) {
            return getWalletAssetsForSelectedWallet($marketCoinPrices)
        } else {
            return {}
        }
    }
)

export const visibleSelectedWalletAssets: Readable<WalletAssets> = derived(
    [selectedWalletAssets],
    ([$selectedWalletAssets]) => {
        const visibleAssets: WalletAssets = {}
        for (const networkId of Object.keys($selectedWalletAssets)) {
            const visible = {
                baseCoin: $selectedWalletAssets[networkId].baseCoin,
                nativeTokens: $selectedWalletAssets[networkId].nativeTokens.filter((asset) => !asset.hidden),
            }
            visibleAssets[networkId] = visible
        }
        return visibleAssets
    }
)

export function getAssetById(assetId: string, networkId: string | number): IAsset | undefined {
    const assets = get(selectedWalletAssets)[networkId]
    const { baseCoin, nativeTokens } = assets ?? {}
    if (assetId === baseCoin?.id) {
        return baseCoin
    } else {
        return nativeTokens?.find((token) => token.id === assetId)
    }
}
