import { getStorageDirectoryOfProfiles } from './getStorageDirectoryOfProfiles'

export const getStorageDirectoryOfProfile = async (id: string): Promise<string> => {
    const profilesStorageDirectory = await getStorageDirectoryOfProfiles()
    return `${profilesStorageDirectory}/${id}`
}
