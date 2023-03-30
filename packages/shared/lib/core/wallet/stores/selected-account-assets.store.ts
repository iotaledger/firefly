import { selectedAccount } from '@core/account/stores/selected-account.store'
import { marketCoinPrices } from '@core/market'
import { activeProfileId } from '@core/profile'
import { derived, get, Readable, writable, Writable } from 'svelte/store'
import { getAccountAssetsForSelectedAccount } from '../actions/getAccountAssetsForSelectedAccount'
import { DEFAULT_ASSET_FILTER } from '../constants'
import { AssetFilter, IAsset } from '../interfaces'
import { IAccountAssets } from '../interfaces/account-assets.interface'
import { persistedAssets } from './persisted-assets.store'

export const assetFilter: Writable<AssetFilter> = writable(DEFAULT_ASSET_FILTER)

export const selectedAccountAssets: Readable<IAccountAssets> = derived(
    [activeProfileId, marketCoinPrices, selectedAccount, persistedAssets, assetFilter],
    ([$activeProfileId, $marketCoinPrices]) => {
        if ($activeProfileId) {
            return getAccountAssetsForSelectedAccount($marketCoinPrices)
        } else {
            return { baseCoin: undefined, nativeTokens: [] }
        }
    }
)

export const visibleSelectedAccountAssets: Readable<IAccountAssets> = derived(
    [selectedAccountAssets],
    ([$selectedAccountAssets]) => ({
        baseCoin: $selectedAccountAssets.baseCoin,
        nativeTokens: $selectedAccountAssets.nativeTokens.filter((asset) => !asset.hidden),
    })
)

export function getAssetById(assetId: string): IAsset {
    const { baseCoin, nativeTokens } = get(selectedAccountAssets)
    if (assetId === baseCoin?.id) {
        return baseCoin
    } else {
        return nativeTokens?.find((token) => token.id === assetId)
    }
}
