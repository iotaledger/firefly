import { writable } from 'svelte/store'

export const hasPendingGovernanceTransaction = writable<{ [accountId: number]: boolean }>({})

export function setHasPendingGovernanceTransactionForAccount(accountId: number): void {
    hasPendingGovernanceTransaction.update((state) => ({ ...state, [accountId]: true }))
}

export function clearHasPendingGovernanceTransactionForAccount(accountId: number): void {
    hasPendingGovernanceTransaction.update((state) => {
        delete state[accountId]
        return state
    })
}

export function resetHasPendingGovernanceTransaction(): void {
    hasPendingGovernanceTransaction.set({})
}
