import { IAccountMetadata, selectedAccountIndex, updateSelectedAccount } from '@core/account'
import { updateAccountMetadataOnActiveProfile } from '@core/profile'
import { get } from 'svelte/store'

export function updateActiveAccountMetadata(index: number, partialAccountMetadata: Partial<IAccountMetadata>): void {
    if (get(selectedAccountIndex) === index) {
        updateSelectedAccount(partialAccountMetadata)
    }
    updateAccountMetadataOnActiveProfile(index, partialAccountMetadata)
}
