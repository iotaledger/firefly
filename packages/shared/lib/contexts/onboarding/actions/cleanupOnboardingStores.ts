import { mnemonic, newProfile, strongholdPassword } from '../stores'

export function cleanupOnboardingStores(): void {
    mnemonic.set(null)
    newProfile.set(null)
    strongholdPassword.set(null)
}
