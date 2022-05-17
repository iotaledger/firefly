import { writable } from 'svelte/store'

import { IAppVersionDetails } from '../interfaces'

/**
 * The current version details of a Firefly installation.
 */
export const appVersionDetails = writable<IAppVersionDetails>({
    upToDate: true,
    currentVersion: '',
    newVersion: '',
    newVersionReleaseDate: new Date(),
    changelog: '',
})
