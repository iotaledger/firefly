import { getStorageDirectoryOfProfile } from './getStorageDirectoryOfProfile'

export const getStorageDirectoryOfWallet = async (profileId: string, walletId: string): Promise<string> => {
    const profilePath = await getStorageDirectoryOfProfile(profileId)
    return `${profilePath}/${walletId}`
}
