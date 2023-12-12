import { onboardingProfile } from '@contexts/onboarding/stores';
import { api } from '@core/api';
import { SecretManager } from '@iota/sdk';
import { Readable, derived, get } from 'svelte/store';

const onboardingProfileSecretManagerOptions = derived(onboardingProfile, ($onboardingProfile) => {
    return $onboardingProfile?.secretManagerOptions
});

export const onboardingProfileSecretManager: Readable<SecretManager | null> = derived(onboardingProfileSecretManagerOptions, ($onboardingProfileSecretManagerOptions, set) => {
    if ($onboardingProfileSecretManagerOptions) {
        api.createSecretManager($onboardingProfileSecretManagerOptions)
            .then((secretManager) => {
                set(secretManager)
            })
    } else {
        set(null)
    }
})

export function isOnboardingSecretManagerInitialized(): boolean {
    return !!get(onboardingProfileSecretManager)
}
