import { IAccountAssets } from '../interfaces/account-assets.interface'
import { persistedAssets } from './persisted-assets.store'
import { activeProfileId } from '@core/profile'
import { getAccountAssetsForSelectedAccount } from '../actions/getAccountAssetsForSelectedAccount'
import { derived, get, Readable, writable, Writable } from 'svelte/store'
import { AssetFilter, IAsset } from '../interfaces'
import { BooleanFilterOption, NotVerifiedStatus, VerifiedStatus } from '../enums'

export const assetFilter: Writable<AssetFilter> = writable({
    verificationStatus: {
        active: false,
        type: 'selection',
        localeKey: 'filters.verificationStatus',
        selected: 'new',
        choices: Object.values(NotVerifiedStatus)
            .map((status) => String(status))
            .concat(Object.values(VerifiedStatus).map((status) => String(status))),
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
    [activeProfileId, persistedAssets],
    ([$activeProfileId]) => {
        if ($activeProfileId) {
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

export function getAssetById(assetId: string): IAsset {
    const { baseCoin, nativeTokens } = get(selectedAccountAssets)
    if (assetId === baseCoin.id) {
        return baseCoin
    } else {
        return nativeTokens?.find((token) => token.id === assetId)
    }
}
