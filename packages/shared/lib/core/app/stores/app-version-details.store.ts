import { writable } from 'svelte/store'

import { Platform } from '../classes'
import { IAppVersionDetails } from '../interfaces'

const DEFAULT_APP_VERSION_DETAILS: IAppVersionDetails = {
    upToDate: true,
    currentVersion: '',
    newVersion: '',
    newVersionReleaseDate: new Date(),
    changelog: '',
}

/**
 * The store containig the application's version details.
 */
export const appVersionDetails = writable<IAppVersionDetails>(DEFAULT_APP_VERSION_DETAILS)

export async function setAppVersionDetails(): Promise<void> {
    const _appVersionDetails = await Platform.getAppVersionDetails()
    appVersionDetails.set(_appVersionDetails)
}
