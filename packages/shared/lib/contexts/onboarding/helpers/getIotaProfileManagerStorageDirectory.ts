import { getStorageDirectoryOfProfiles } from '@core/profile'

import { IOTA_PROFILE_MANAGER_DIRECTORY_NAME } from '../constants'

export async function getIotaProfileManagerStorageDirectory(): Promise<string> {
    const storageDir = await getStorageDirectoryOfProfiles()
    return `${storageDir}/${IOTA_PROFILE_MANAGER_DIRECTORY_NAME}`
}
