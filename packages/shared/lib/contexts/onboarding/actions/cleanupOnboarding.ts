import { onboardingProfile, onboardingProfileSecretManager } from '../stores'
import { deleteOnboardingProfile } from './deleteOnboardingProfile'

export async function cleanupOnboarding(deleteProfile: boolean = false): Promise<void> {
    onboardingProfile.set(null)
    onboardingProfileSecretManager.set(null)
    if (deleteProfile) {
        await deleteOnboardingProfile()
    }
}

