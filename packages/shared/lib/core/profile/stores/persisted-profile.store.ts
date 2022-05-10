import { activeProfileId, newProfile, profiles } from '@lib/profile'
import { derived, Readable } from 'svelte/store'
import { IPersistedProfile } from '../interfaces'

export const persistedProfile: Readable<IPersistedProfile> = derived(
    [profiles, newProfile, activeProfileId],
    ([$profiles, $newProfile, $activeProfileId]) => $newProfile || $profiles.find((p) => p.id === $activeProfileId)
)
