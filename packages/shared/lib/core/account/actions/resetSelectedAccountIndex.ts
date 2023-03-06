import { selectedAccountIndex } from '../stores'

export function resetSelectedAccountIndex(): void {
    selectedAccountIndex.set(null)
}
