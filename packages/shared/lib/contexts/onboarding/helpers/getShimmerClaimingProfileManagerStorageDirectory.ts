import { getStorageDirectoryOfProfiles } from '@core/profile'

import { SHIMMER_CLAIMING_PROFILE_MANAGER_DIRECTORY_NAME } from '../constants'

export async function getShimmerClaimingProfileManagerStorageDirectory(): Promise<string> {
    const storageDir = await getStorageDirectoryOfProfiles()
    return `${storageDir}/${SHIMMER_CLAIMING_PROFILE_MANAGER_DIRECTORY_NAME}`
}
