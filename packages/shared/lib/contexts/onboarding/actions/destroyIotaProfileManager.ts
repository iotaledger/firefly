import { get } from 'svelte/store'

import { getStorageDirectoryOfProfiles } from '@core/profile'
import { destroyProfileManager } from '@core/profile-manager'
import { iotaProfileManager } from '@contexts/onboarding'
import { Platform } from '@lib/platform'

export async function destroyIotaProfileManager(): Promise<void> {
    const _iotaProfileManager = get(iotaProfileManager)
    if (!_iotaProfileManager) {
        return
    }
    destroyProfileManager(iotaProfileManager)
    const storageDir = await getStorageDirectoryOfProfiles()
    await Platform.removeProfileFolder(`${storageDir}/temp`)
}
