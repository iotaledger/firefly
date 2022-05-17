import { profiles, setActiveProfile } from '@core/profile'
import { Platform } from '@lib/platform'
import { get } from 'svelte/store'

export function loadPersistedProfileIntoActiveProfile(profileId: string): void {
    const persistedProfile = get(profiles).find((_persistedProfile) => _persistedProfile.id === profileId)
    if (persistedProfile) {
        setActiveProfile(persistedProfile)
    }
}
