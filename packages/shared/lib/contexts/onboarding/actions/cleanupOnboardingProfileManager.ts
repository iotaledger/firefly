import { get } from 'svelte/store'

import { clearProfileFromMemory, profileManager } from '@core/profile-manager'
import { removeProfileFolder } from '@core/profile'

export async function cleanupOnboardingProfileManager(): Promise<void> {
    if (!get(profileManager)) {
        return
    }

    const { id } = get(profileManager)

    await clearProfileFromMemory()
    await removeProfileFolder(id)
}
