import { writable } from 'svelte/store'

export const isInternalTransaction = writable<boolean>(false)

export function resetIsInternalTransaction(): void {
    isInternalTransaction.set(false)
}
