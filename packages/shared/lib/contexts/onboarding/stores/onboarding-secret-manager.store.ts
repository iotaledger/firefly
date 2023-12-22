import { onboardingProfile, updateOnboardingProfile } from '@contexts/onboarding/stores'
import { api } from '@core/api'
import { SecretManager } from '@iota/sdk'
import { verifyMnemonic } from 'shared/lib/core/secret-manager'
import { get, writable, Writable } from 'svelte/store'

export const onboardingProfileSecretManager: Writable<SecretManager | null> = writable(null)

export async function buildOnboardingSecretManager(): Promise<void> {
    const profile = get(onboardingProfile)
    if (profile) {
        const { strongholdPassword, secretManagerOptions, mnemonic } = profile
        const mnemonicStringified = mnemonic?.join(' ') ?? ''

        // 1. Create SecretManager
        const secretManager = await api.createSecretManager(secretManagerOptions!)
        
        // 2. Load the stronghold password specified in the onboarding if necessary
        if(strongholdPassword){
            await secretManager.setStrongholdPassword(strongholdPassword);
        }
      
        // 3. Verify Mnemonic
        await verifyMnemonic(mnemonicStringified);

        // 4. Store Mnemonic
        await secretManager.storeMnemonic(mnemonicStringified)

        // 5. Generate address
        const address = (await secretManager.generateEd25519Addresses({}))[0];

        updateOnboardingProfile({
            address
        })
        onboardingProfileSecretManager.set(secretManager)
    } else {
        onboardingProfileSecretManager.set(null)
    }
}

export function isOnboardingSecretManagerInitialized(): boolean {
    return !!get(onboardingProfileSecretManager)
}
