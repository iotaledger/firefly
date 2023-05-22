import { IAccountPersistedData, selectedAccountIndex, updateSelectedAccount } from '@core/account'
import { updateAccountPersistedDataOnActiveProfile } from '@core/profile'
import { get } from 'svelte/store'

export function updateActiveAccountMetadata(
    acccountIndex: number,
    partialAccountMetadata: Partial<IAccountPersistedData>
): void {
    if (get(selectedAccountIndex) === acccountIndex) {
        updateSelectedAccount(partialAccountMetadata)
    }
    updateAccountPersistedDataOnActiveProfile(acccountIndex, partialAccountMetadata)
}
