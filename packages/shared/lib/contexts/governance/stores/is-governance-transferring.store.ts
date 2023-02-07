import { writable } from 'svelte/store'

export const isGovernanceTransferring = writable<{ [accountId: number]: boolean }>({})

export function setPendingGovernanceTransactionIdForAccount(accountId: number): void {
    isGovernanceTransferring.update((state) => ({ ...state, [accountId]: true }))
}

export function clearPendingGovernanceTransactionIdForAccount(accountId: number): void {
    isGovernanceTransferring.update((state) => {
        delete state[accountId]
        return state
    })
}

export function resetisGovernanceTransferring(): void {
    isGovernanceTransferring.set({})
}
