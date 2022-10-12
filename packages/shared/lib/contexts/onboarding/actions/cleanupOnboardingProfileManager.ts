import { get } from 'svelte/store'

import { destroyProfileManager, profileManager } from '@core/profile-manager'
import { removeProfileFolder } from '@core/profile'

export async function cleanupOnboardingProfileManager(): Promise<void> {
    const { id } = get(profileManager)
    if (!get(profileManager)) {
        return
    }

    destroyProfileManager()
    await removeProfileFolder(id)
}
