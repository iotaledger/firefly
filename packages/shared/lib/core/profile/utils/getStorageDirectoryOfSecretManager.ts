import { getStorageDirectoryOfProfile } from './getStorageDirectoryOfProfile'

export const getStorageDirectoryOfSecretManager = async (profileId: string): Promise<string> => {
    const profilePath = await getStorageDirectoryOfProfile(profileId)
    return `${profilePath}/secret-manager`
}
