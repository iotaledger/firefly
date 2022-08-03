import { mnemonic, onboardingProfile, strongholdPassword } from '../stores'

export function cleanupOnboardingStores(): void {
    mnemonic.set(null)
    onboardingProfile.set(null)
    strongholdPassword.set(null)
}
