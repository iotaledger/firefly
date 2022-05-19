import { writable } from 'svelte/store'

export const appUpdateProgress = writable<number>(0)

export const appUpdateMinutesRemaining = writable<number>(-1)

export const appUpdateBusy = writable<boolean>(false)

export const appUpdateComplete = writable<boolean>(false)

export const appUpdateError = writable<boolean>(false)
