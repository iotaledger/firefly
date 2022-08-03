import { IAccountAssets } from '../interfaces/account-assets.interface'
import { persistedAssets } from './persisted-assets.store'
import { activeProfileId } from '@core/profile'
import { selectedAccountId } from '@core/account/stores/selected-account-id.store'
import { getAccountAssetsForSelectedAccount } from '../actions/getAccountAssetsForSelectedAccount'
import { derived, Readable, writable, Writable } from 'svelte/store'
import { AssetFilter } from '../interfaces/filter.interface'

export const assetFilter: Writable<AssetFilter> = writable({
    showHidden: { active: false, type: 'boolean', label: 'filters.showHidden' },
})

export const selectedAccountAssets: Readable<IAccountAssets> = derived(
    [activeProfileId, selectedAccountId, persistedAssets, assetFilter],
    ([$activeProfileId, $selectedAccountId]) => {
        if ($activeProfileId && $selectedAccountId) {
            return getAccountAssetsForSelectedAccount()
        } else {
            return { baseCoin: undefined, nativeTokens: [] }
        }
    }
)
