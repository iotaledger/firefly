import { getStorageDirectoryOfProfiles } from '@core/profile'
import { TEMPORARY_WALLET_DIRECTORY_NAME } from '../constants'

export async function getTemporaryWalletStorageDirectory(): Promise<string> {
    const storageDir = await getStorageDirectoryOfProfiles()
    return `${storageDir}/${TEMPORARY_WALLET_DIRECTORY_NAME}`
}
