import { onboardingProfileSecretManager } from 'shared/lib/contexts/onboarding'
import { get } from 'svelte/store'

export async function storeMnemonic(mnemonic: string): Promise<void> {
    // TODO(2.0) There are two secret managers, but we might only actually need one to store the mnemonic.
    const secretManager = get(onboardingProfileSecretManager)

    if (!secretManager) {
        return undefined
    }
    return secretManager.storeMnemonic(mnemonic)
}
