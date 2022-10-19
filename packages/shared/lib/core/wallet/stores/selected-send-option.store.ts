import { writable } from 'svelte/store'

export const selectedSendOptionIndex = writable<number>(0)

export function resetSendOptionIndex(): void {
    selectedSendOptionIndex.set(0)
}
