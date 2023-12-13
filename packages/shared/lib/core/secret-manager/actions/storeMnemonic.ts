import { onboardingProfileSecretManager } from 'shared/lib/contexts/onboarding'
import { get } from 'svelte/store'
import { activeProfileSecretManager } from '../stores'

export async function storeMnemonic(mnemonic: string): Promise<void> {
    // TODO(2.0) There are two secret managers, but we might only actually need one to store the mnemonic.
    const secretManager = get(onboardingProfileSecretManager)    

    console.log(secretManager)

    if (!secretManager) {
        return undefined
    }
    return secretManager.storeMnemonic(mnemonic)
}
