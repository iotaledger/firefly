import { get } from 'svelte/store'

import { destroyProfileManager } from '@core/profile-manager'
import { Platform } from '@lib/platform'

import { getIotaProfileManagerStorageDirectory } from '../helpers'
import { iotaProfileManager } from '../stores'

export async function destroyIotaProfileManager(): Promise<void> {
    const _iotaProfileManager = get(iotaProfileManager)
    if (!_iotaProfileManager) {
        return
    }
    destroyProfileManager(iotaProfileManager)
    const profilePath = await getIotaProfileManagerStorageDirectory()
    await Platform.removeProfileFolder(profilePath)
}
