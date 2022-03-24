import { writable } from 'svelte/store'

import { VersionDetails } from '../types'

export const updateBusy = writable<boolean>(false)

export const updateComplete = writable<boolean>(false)

export const updateError = writable<boolean>(false)

export const updateMinutesRemaining = writable<number>(-1)

export const updateProgress = writable<number>(0)

export const versionDetails = writable<VersionDetails>({
    upToDate: true,
    currentVersion: '',
    newVersion: '',
    newVersionReleaseDate: new Date(),
    changelog: '',
})
