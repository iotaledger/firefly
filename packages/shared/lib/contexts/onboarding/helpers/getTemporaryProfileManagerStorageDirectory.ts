import { getStorageDirectoryOfProfiles } from '@core/profile'

import { TEMPORARY_PROFILE_MANAGER_DIRECTORY_NAME } from '../constants'

export async function getTemporaryProfileManagerStorageDirectory(): Promise<string> {
    const storageDir = await getStorageDirectoryOfProfiles()
    return `${storageDir}/${TEMPORARY_PROFILE_MANAGER_DIRECTORY_NAME}`
}
