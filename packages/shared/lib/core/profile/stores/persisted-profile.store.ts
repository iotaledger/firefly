import { activeProfileId, newProfile } from '@lib/profile'
import { derived, Readable } from 'svelte/store'
import { IPersistedProfile } from '../interfaces'
import { profiles } from './profiles.store'

export const persistedProfile: Readable<IPersistedProfile> = derived(
    [profiles, newProfile, activeProfileId],
    ([$profiles, $newProfile, $activeProfileId]) => $newProfile || $profiles.find((p) => p.id === $activeProfileId)
)
