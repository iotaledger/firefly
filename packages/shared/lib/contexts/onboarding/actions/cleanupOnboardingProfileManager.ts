import { get } from 'svelte/store'

import { deleteAccountsAndDatabase, destroyProfileManager, profileManager } from '@core/profile-manager'

export async function cleanupOnboardingProfileManager(): Promise<void> {
    if (!get(profileManager)) {
        return
    }

    await deleteAccountsAndDatabase()
    destroyProfileManager()
}
