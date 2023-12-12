import { onboardingProfile } from '@contexts/onboarding/stores';
import { api } from '@core/api';
import { SecretManager } from '@iota/sdk';
import { Readable, derived, get } from 'svelte/store';

onboardingProfile.subscribe(console.log)


const onboardingProfileSecretManagerOptions = derived(onboardingProfile, ($onboardingProfile) => {
    console.log("derived", $onboardingProfile?.secretManagerOptions)
    return $onboardingProfile?.secretManagerOptions
});

export const onboardingProfileSecretManager: Readable<SecretManager | null> = derived(onboardingProfileSecretManagerOptions, ($onboardingProfileSecretManagerOptions, set) => {
    console.log("creating SC", $onboardingProfileSecretManagerOptions)
    if ($onboardingProfileSecretManagerOptions) {
        api.createSecretManager($onboardingProfileSecretManagerOptions)
            .then((secretManager) => {
                console.log("secret manager created", secretManager)
                set(secretManager)
            })
    } else {
        set(null)
    }
})

export function isOnboardingSecretManagerInitialized(): boolean {
    return !!get(onboardingProfileSecretManager)
}
