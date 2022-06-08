import { Platform } from '@lib/platform'

import { PROFILE_STORAGE_DIRECTORY } from '../constants'

export const getStorageDirectoryOfProfiles = async (): Promise<string> => {
    const appPath = await Platform.getUserDataPath()
    return `${appPath}/${PROFILE_STORAGE_DIRECTORY}`
}
