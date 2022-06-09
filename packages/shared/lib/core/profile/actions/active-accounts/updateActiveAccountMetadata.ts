import { IAccountMetadata, selectedAccountId, updateSelectedAccount } from '@core/account'
import { updateAccountMetadataOnActiveProfile, updateActiveAccount } from '@core/profile'
import { get } from 'svelte/store'

export function updateActiveAccountMetadata(id: string, partialAccountMetadata: Partial<IAccountMetadata>): void {
    if (get(selectedAccountId) === id) {
        updateSelectedAccount(partialAccountMetadata)
    }
    updateAccountMetadataOnActiveProfile(id, partialAccountMetadata)
}
