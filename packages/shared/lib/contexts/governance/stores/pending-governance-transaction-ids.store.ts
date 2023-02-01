import { writable } from 'svelte/store'

export const pendingGovernanceTransactionIds = writable<{ [accountId: number]: string }>({})

export function setPendingGovernanceTransactionIdForAccount(accountId: number, transactionId: string): void {
    pendingGovernanceTransactionIds.update((state) => ({ ...state, [accountId]: transactionId }))
}

export function clearPendingGovernanceTransactionIdForAccount(accountId: number): void {
    pendingGovernanceTransactionIds.update((state) => {
        delete state[accountId]
        return state
    })
}

export function resetPendingGovernanceTransactionIds(): void {
    pendingGovernanceTransactionIds.set({})
}
