import { IAccountAssets } from '../interfaces/account-assets.interface'
import { persistedAssets } from './persisted-assets.store'
import { activeProfileId } from '@core/profile'
import { selectedAccountId } from '@core/account/stores/selected-account-id.store'
import { getAccountAssetsForSelectedAccount } from '../actions/getAccountAssetsForSelectedAccount'
import { derived, Readable, writable, Writable } from 'svelte/store'
import { AssetFilter } from '../interfaces'
import { BooleanFilterOption, NotVerifiedStatus, VerifiedStatus } from '../enums'

export const assetFilter: Writable<AssetFilter> = writable({
    verificationStatus: {
        active: false,
        type: 'selection',
        localeKey: 'filters.verificationStatus',
        selected: 'verified',
        choices: Object.values(VerifiedStatus)
            .map((status) => String(status))
            .concat(Object.values(NotVerifiedStatus).map((status) => String(status))),
    },
    showHidden: {
        active: false,
        type: 'selection',
        localeKey: 'filters.showHidden',
        selected: BooleanFilterOption.Yes,
        choices: [BooleanFilterOption.Yes, BooleanFilterOption.No],
    },
})

export const selectedAccountAssets: Readable<IAccountAssets> = derived(
    [activeProfileId, selectedAccountId, persistedAssets],
    ([$activeProfileId, $selectedAccountId]) => {
        if ($activeProfileId && $selectedAccountId) {
            return getAccountAssetsForSelectedAccount()
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
