import { writable } from 'svelte/store'

/**
 * The store containing a number indicating the download progress of an application update.
 */
export const appUpdateProgress = writable<number>(0)

/**
 * The store containing the number of the minutes remaining for downloading an application update.
 */
export const appUpdateMinutesRemaining = writable<number>(-1)

/**
 * The store containing a boolean value for if the application is busy due to downloading an update.
 */
export const appUpdateBusy = writable<boolean>(false)

/**
 * The store containing a boolean value for if the application update download is complete.
 */
export const appUpdateComplete = writable<boolean>(false)

/**
 * The store containing a boolean value for if an error has occurred during an application update download.
 */
export const appUpdateError = writable<boolean>(false)
