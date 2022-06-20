import { mnemonic, strongholdPassword } from '../stores'

export function cleanupOnboardingStores(): void {
    mnemonic.set(null)
    strongholdPassword.set(null)
}
