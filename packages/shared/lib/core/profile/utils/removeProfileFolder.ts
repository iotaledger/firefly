import { Platform } from '@lib/platform'
import { getProfileDataPath } from '@lib/wallet'

/**
 * Remove the profile folder from storage
 * @method removeProfileFolder
 * @param {string} id
 * @returns {void}
 */
export const removeProfileFolder = async (id: string): Promise<void> => {
    try {
        const profileDataPath = await getProfileDataPath(id)
        await Platform.removeProfileFolder(profileDataPath)
    } catch (err) {
        // TODO: improve error handling here
        console.error(err)
    }
}
