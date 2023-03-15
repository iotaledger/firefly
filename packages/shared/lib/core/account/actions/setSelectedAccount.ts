import { get } from 'svelte/store'
import { activeAccounts, updateActiveProfile } from '@core/profile/stores'
import { resetSendOptionIndex } from '@core/wallet/stores'

import { selectedAccountIndex } from '../stores'
import { clearFilters } from '@core/utils'

export function setSelectedAccount(index: number): void {
    const account = get(activeAccounts)?.find((_account) => _account.index === index)
    if (account) {
        selectedAccountIndex.set(index)
        updateActiveProfile({ lastUsedAccountIndex: index })
        clearFilters()
        resetSendOptionIndex()
    } else {
        throw new Error(`Account with ID ${index} cannot be found!`)
    }
}
