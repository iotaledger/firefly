import { IAccountAssets } from '../interfaces/account-assets.interface'
import { derived, Readable } from 'svelte/store'
import { selectedAccount } from '../../account/stores/selected-account.store'
import { persistedAssets } from './persisted-assets.store'
import { activeProfile, activeProfileId } from '@core/profile'
import { selectedAccountId } from '@core/account'
import { getAccountAssetsForSelectedAccount } from '../actions/getAccountAssetsForSelectedAccount'

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
