import { get } from 'svelte/store'

import { activeAccounts, updateActiveProfile } from '@core/profile/stores'
import { resetSendOptionIndex } from '@core/wallet/stores'

import { selectedAccount, selectedAccountIndex } from '../stores'

export function setSelectedAccount(index: number): void {
    const account = get(activeAccounts)?.find((_account) => _account.index === index)
    if (account) {
        selectedAccountIndex.set(index)
        selectedAccount.set(account)
        updateActiveProfile({ lastUsedAccountIndex: index })
        resetSendOptionIndex()
    } else {
        throw new Error(`Account with ID ${index} cannot be found!`)
    }
}
