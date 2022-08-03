import { onboardingProfile, strongholdPassword } from '../stores'

export function cleanupOnboardingStores(): void {
    onboardingProfile.set(null)
    strongholdPassword.set(null)
}
