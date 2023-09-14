import { Platform } from '@core/app'

import { PROFILE_STORAGE_DIRECTORY } from '../constants'

export const getStorageDirectoryOfProfiles = async (): Promise<string> => {
    const appPath = await Platform.getUserDataPath()
    return `${appPath}/${PROFILE_STORAGE_DIRECTORY}`
}

export let storageDirectoryOfProfiles = ''

window.addEventListener('load', () => {
    getStorageDirectoryOfProfiles().then((path) => {
        storageDirectoryOfProfiles = path
    })
})
