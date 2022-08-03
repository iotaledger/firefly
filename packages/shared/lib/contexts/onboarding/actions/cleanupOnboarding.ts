import { deleteOnboardingProfile } from './deleteOnboardingProfile'
import { destroyIotaProfileManager } from './destroyIotaProfileManager'
import { onboardingProfile } from '@contexts/onboarding'

export async function cleanupOnboarding(deleteProfile: boolean = false): Promise<void> {
    onboardingProfile.set(null)
    await cleanupExtraProfileManagers()
    if (deleteProfile) {
        await deleteOnboardingProfile()
    }
}

async function cleanupExtraProfileManagers(): Promise<void> {
    await destroyIotaProfileManager()
}
