import { selectedAccount, selectedAccountIndex } from '../stores'

export function resetSelectedAccount(): void {
    selectedAccountIndex.set(null)
    selectedAccount.set(null)
}
