import { importFile, importFilePath, mnemonic, onboardingProfile, strongholdPassword } from '../stores'

export function cleanupOnboardingStores(): void {
    importFile.set(null)
    importFilePath.set(null)
    mnemonic.set(null)
    onboardingProfile.set(null)
    strongholdPassword.set(null)
}
