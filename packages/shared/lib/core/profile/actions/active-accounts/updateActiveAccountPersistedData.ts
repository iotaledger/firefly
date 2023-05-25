import { selectedAccountIndex, updateSelectedAccount } from '@core/account/stores'
import { IPersistedAccountData } from '@core/account/interfaces'
import { updateAccountPersistedDataOnActiveProfile } from '@core/profile/stores'
import { get } from 'svelte/store'

export function updateActiveAccountPersistedData(
    acccountIndex: number,
    partialAccountPersistedData: Partial<IPersistedAccountData>
): void {
    if (get(selectedAccountIndex) === acccountIndex) {
        updateSelectedAccount(partialAccountPersistedData)
    }
    updateAccountPersistedDataOnActiveProfile(acccountIndex, partialAccountPersistedData)
}
