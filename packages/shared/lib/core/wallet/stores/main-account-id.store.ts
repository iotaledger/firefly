import { writable } from 'svelte/store'

export const mainAccountId = writable<string>(null)

export function updateMainAccountId(payload: string): void {
    mainAccountId.update(() => payload)
}
