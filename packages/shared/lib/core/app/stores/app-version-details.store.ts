import { writable } from 'svelte/store'

import { Platform } from '@lib/platform'

import { AppVersionDetails } from '../interfaces'

const DEFAULT_APP_VERSION_DETAILS: AppVersionDetails = {
    upToDate: true,
    currentVersion: '',
    newVersion: '',
    newVersionReleaseDate: new Date(),
    changelog: '',
}

export const versionDetails = writable<AppVersionDetails>(DEFAULT_APP_VERSION_DETAILS)

export async function setAppVersionDetails(): Promise<void> {
    const verDetails = await Platform.getAppVersionDetails()
    versionDetails.set(verDetails)
}
