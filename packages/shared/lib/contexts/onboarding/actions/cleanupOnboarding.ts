import { onboardingProfile } from '../stores'
import { deleteOnboardingProfile } from './deleteOnboardingProfile'
import { destroyShimmerClaimingProfileManager } from './destroyShimmerClaimingProfileManager'

export async function cleanupOnboarding(deleteProfile: boolean = false): Promise<void> {
    onboardingProfile.set(null)
    await cleanupExtraProfileManagers()
    if (deleteProfile) {
        await deleteOnboardingProfile()
    }
}

async function cleanupExtraProfileManagers(): Promise<void> {
    await destroyShimmerClaimingProfileManager()
}
