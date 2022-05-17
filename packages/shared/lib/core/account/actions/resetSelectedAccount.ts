import { selectedAccount, selectedAccountId } from '../stores'

export function resetSelectedAccount(): void {
    selectedAccountId.set(null)
    selectedAccount.set(null)
}
