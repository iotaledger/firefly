import { writable } from 'svelte/store'

export const mainAccountId = writable<string | null>(null)

export function updateMainAccountId(payload: string): void {
    mainAccountId.set(payload)
}
