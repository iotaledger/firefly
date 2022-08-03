import { getStorageDirectoryOfProfiles } from '@core/profile'

export async function getIotaProfileManagerStorageDirectory(): Promise<string> {
    const storageDir = await getStorageDirectoryOfProfiles()
    const iotaProfileManagerDirectoryName = 'temp'
    return `${storageDir}/${iotaProfileManagerDirectoryName}`
}
