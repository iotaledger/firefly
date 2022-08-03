import { IAccountAssets } from '../interfaces/account-assets.interface'
import { persistedAssets } from './persisted-assets.store'
import { activeProfileId } from '@core/profile'
import { selectedAccountId } from '@core/account/stores/selected-account-id.store'
import { getAccountAssetsForSelectedAccount } from '../actions/getAccountAssetsForSelectedAccount'
import { derived, Readable, writable, Writable } from 'svelte/store'
import { AssetFilter } from '../interfaces'
import { VerificationStatus } from '../enums'

export const assetFilter: Writable<AssetFilter> = writable({
    showHidden: { active: false, type: 'boolean', localeKey: 'filters.showHidden' },
    verificationStatus: {
        active: false,
        type: 'selection',
        localeKey: 'filters.verificationStatus',
        selected: 'verified',
        choices: Object.values(VerificationStatus).map((status) => String(status)),
    },
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
