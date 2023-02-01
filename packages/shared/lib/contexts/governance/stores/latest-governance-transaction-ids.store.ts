import { writable } from 'svelte/store'

export const latestGovernanceTransactionIds = writable<{ [accountId: number]: string }>({})

export function setLatestGovernanceTransactionIdForAccount(accountId: number, transactionId: string): void {
    latestGovernanceTransactionIds.update((state) => ({ ...state, [accountId]: transactionId }))
}

export function clearLatestGovernanceTransactionIdForAccount(accountId: number): void {
    latestGovernanceTransactionIds.update((state) => {
        delete state[accountId]
        return state
    })
}

export function resetLatestGovernanceTransactionIds(): void {
    latestGovernanceTransactionIds.set({})
}
