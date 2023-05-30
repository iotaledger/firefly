import { selectedAccount } from '@core/account/stores/selected-account.store'
import { marketCoinPrices } from '@core/market'
import { activeProfileId } from '@core/profile'
import { derived, get, Readable, writable, Writable } from 'svelte/store'
import { getAccountAssetsForSelectedAccount } from '../actions/getAccountAssetsForSelectedAccount'
import { DEFAULT_ASSET_FILTER } from '../constants'
import { AssetFilter, IAsset } from '../interfaces'
import { AccountAssets } from '../interfaces/account-assets.interface'
import { persistedAssets } from './persisted-assets.store'

export const assetFilter: Writable<AssetFilter> = writable(DEFAULT_ASSET_FILTER)

export const selectedAccountAssets: Readable<AccountAssets> = derived(
    [activeProfileId, marketCoinPrices, selectedAccount, persistedAssets, assetFilter],
    ([$activeProfileId, $marketCoinPrices]) => {
        if ($activeProfileId) {
            return getAccountAssetsForSelectedAccount($marketCoinPrices)
        } else {
            return {}
        }
    }
)

export const visibleSelectedAccountAssets: Readable<AccountAssets> = derived(
    [selectedAccountAssets],
    ([$selectedAccountAssets]) => {
        const visibleAssets: AccountAssets = {}
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
