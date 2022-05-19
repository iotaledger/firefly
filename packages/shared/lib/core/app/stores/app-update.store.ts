import { writable } from 'svelte/store'

export const updateProgress = writable<number>(0)

export const updateMinutesRemaining = writable<number>(-1)

export const updateBusy = writable<boolean>(false)

export const updateComplete = writable<boolean>(false)

export const updateError = writable<boolean>(false)
