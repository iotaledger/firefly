import { api } from '@core/api';
import { activeProfile } from '@core/profile/stores';
import { SecretManager } from '@iota/sdk';
import { Readable, derived } from 'svelte/store';

const activeProfileSecretManagerOptions = derived(activeProfile, ($activeProfile) => $activeProfile.secretManagerOptions);

export const activeProfileSecretManager: Readable<SecretManager | null> = derived(activeProfileSecretManagerOptions, (activeProfileSecretManagerOptions, set) => {
    if (activeProfileSecretManagerOptions) {
        api.createSecretManager(activeProfileSecretManagerOptions)
            .then((secretManager) => {
                set(secretManager)
            })
    } else {
        set(null)
    }
})
