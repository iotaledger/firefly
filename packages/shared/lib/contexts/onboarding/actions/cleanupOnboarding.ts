import { deleteNewProfile } from '@contexts/onboarding/actions/newProfile'

import { cleanupOnboardingStores } from './cleanupOnboardingStores'

export async function cleanupOnboarding(deleteProfile: boolean = false): Promise<void> {
    cleanupOnboardingStores()
    if (deleteProfile) {
        await deleteNewProfile()
    }
}
