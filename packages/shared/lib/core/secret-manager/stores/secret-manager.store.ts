import { api } from '@core/api'
import { activeProfile } from '@core/profile/stores/active-profile.store'
import { SecretManager, SecretManagerType } from '@iota/sdk'
import { writable } from 'svelte/store'

export const activeProfileSecretManager = writable<SecretManager | null>(null)

let oldSecretManagerOptions: SecretManagerType | null = null
activeProfile.subscribe((profile) => {
    if (profile.secretManagerOptions && oldSecretManagerOptions !== profile.secretManagerOptions) {
        api.createSecretManager(profile.secretManagerOptions).then((secretManager) => {
            activeProfileSecretManager.set(secretManager)
        })
        oldSecretManagerOptions = profile.secretManagerOptions
    } else {
        activeProfileSecretManager.set(null)
    }
})
