import { writable } from 'svelte/store'

export const timeStrongholdLastUnlocked = writable<Date>(undefined)

export function setTimeStrongholdLastUnlocked(): void {
    timeStrongholdLastUnlocked.set(new Date())
}

export function clearTimeStrongholdLastUnlocked(): void {
    timeStrongholdLastUnlocked.set(undefined)
}
