import { get } from 'svelte/store'

import { destroyProfileManager, profileManager } from '@core/profile-manager'
import { removeProfileFolder } from '@core/profile'

export async function cleanupOnboardingProfileManager(): Promise<void> {
    if (!get(profileManager)) {
        return
    }

    const { id } = get(profileManager)

    destroyProfileManager()
    await removeProfileFolder(id)
}
