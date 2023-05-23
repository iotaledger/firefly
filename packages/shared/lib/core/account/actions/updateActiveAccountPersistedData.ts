import { IPersistedAccountData, selectedAccountIndex, updateSelectedAccount } from '@core/account'
import { updateAccountPersistedDataOnActiveProfile } from '@core/profile'
import { get } from 'svelte/store'

export function updateSelectedAccountPersistedData(
    acccountIndex: number,
    partialAccountPersistedData: Partial<IPersistedAccountData>
): void {
    if (get(selectedAccountIndex) === acccountIndex) {
        updateSelectedAccount(partialAccountPersistedData)
    }
    updateAccountPersistedDataOnActiveProfile(acccountIndex, partialAccountPersistedData)
}
