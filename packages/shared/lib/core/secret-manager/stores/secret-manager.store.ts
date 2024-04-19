import { api } from '@core/api'
import { activeProfile } from '@core/profile/stores'
import { SecretManager, type SecretManagerType } from '@iota/sdk'
import { writable } from 'svelte/store'

export const activeProfileSecretManager = writable<SecretManager | null>(null)

// Required to check if there is already a created instance of secretManager
let oldSecretManagerOptions: SecretManagerType | null = null
// subscribe is needed because a derived store is only subscribed when used in a svelte component
// activeProfileSecretManager is used outside of svelte components too
activeProfile.subscribe((profile) => {
    // Dont create a new instance of secretManager when it is already initialized
    if (profile.secretManagerOptions) {
        if (oldSecretManagerOptions !== profile.secretManagerOptions) {
            api.createSecretManager(profile.secretManagerOptions).then((secretManager) => {
                activeProfileSecretManager.set(secretManager)
            })
            oldSecretManagerOptions = profile.secretManagerOptions
        }
    } else {
        activeProfileSecretManager.set(null)
        oldSecretManagerOptions = null
    }
})
