import { derived, Readable } from 'svelte/store'
import { IPersistedProfile } from '../interfaces'
import { activeProfileId } from './active-profile-id.store'
import { newProfile } from './new-profile.store'
import { profiles } from './profiles.store'

export const persistedProfile: Readable<IPersistedProfile> = derived(
    [profiles, activeProfileId],
    ([$profiles, $activeProfileId]) => $profiles.find((p) => p.id === $activeProfileId)
)
