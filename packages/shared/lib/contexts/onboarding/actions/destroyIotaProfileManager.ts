import { iotaProfileManager } from '@contexts/onboarding'
import { getStorageDirectoryOfProfiles } from '@core/profile'
import { destroyProfileManager } from '@core/profile-manager'
import { Platform } from '@lib/platform'

export async function destroyIotaProfileManager(): Promise<void> {
    destroyProfileManager(iotaProfileManager)
    const storageDir = await getStorageDirectoryOfProfiles()
    await Platform.removeProfileFolder(`${storageDir}/temp`)
}
