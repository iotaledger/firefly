import { onboardingProfile } from '@contexts/onboarding/stores'
import { api } from '@core/api'
import { SecretManager } from '@iota/sdk'
import { get, writable, Writable } from 'svelte/store'

export const onboardingProfileSecretManager: Writable<SecretManager | null> = writable(null)

export async function buildOnboardingSecretManager(): Promise<void> {
    const profile = get(onboardingProfile)
    if (profile) {
        const { strongholdPassword, secretManagerOptions } = profile
        console.log(secretManagerOptions, strongholdPassword)
        // Create secret manager with persisted options
        const secretManager = await api.createSecretManager(secretManagerOptions!)

        console.log(secretManager)
        // Load the stronghold password specified in the onboarding if necessary
        if(strongholdPassword){
            await secretManager.setStrongholdPassword(strongholdPassword);
            console.log("setted strongholdPassword")
        }

        onboardingProfileSecretManager.set(secretManager)
    } else {
        onboardingProfileSecretManager.set(null)
    }
}

export function isOnboardingSecretManagerInitialized(): boolean {
    return !!get(onboardingProfileSecretManager)
}
