import { IAssetState } from '../interfaces/assets-state.interface'
import { derived, Readable } from 'svelte/store'
import { selectedAccount } from '../../account/stores/selected-account.store'
import { assets } from './assets.store'

export const selectedAssets: Readable<IAssetState> = derived(
    [selectedAccount, assets],
    ([$selectedAccount, $assets]) => {
        if (selectedAccount) {
            return $assets[$selectedAccount?.id] ?? { basecoin: undefined, nativeTokens: [] }
        } else {
            return { basecoin: undefined, nativeTokens: [] }
        }
    }
)
