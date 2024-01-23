import { onboardingProfile } from '../stores'
import { deleteOnboardingProfile } from './deleteOnboardingProfile'
import { destroyShimmerClaimingWallet } from './destroyShimmerClaimingWallet'

export async function cleanupOnboarding(deleteProfile: boolean = false): Promise<void> {
    onboardingProfile.set(null)
    await cleanupExtraWallets()
    if (deleteProfile) {
        await deleteOnboardingProfile()
    }
}

async function cleanupExtraWallets(): Promise<void> {
    await destroyShimmerClaimingWallet()
}
