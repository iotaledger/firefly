import { deleteNewProfile } from '@core/profile/actions/new-profile'

import { cleanupOnboardingStores } from './cleanupOnboardingStores'

export async function cleanupOnboarding(deleteProfile: boolean = false): Promise<void> {
    cleanupOnboardingStores()
    if (deleteProfile) {
        await deleteNewProfile()
    }
}
