import { derived, Readable } from 'svelte/store'
import { IPersistedProfile } from '../interfaces'
import { activeProfileId } from './active-profile-id.store'
import { newProfile } from './new-profile.store'
import { profiles } from './profiles.store'

// TODO: this doesn't need to be a store and can be function on a load active profile action
export const persistedProfile: Readable<IPersistedProfile> = derived(
    [profiles, activeProfileId],
    ([$profiles, $activeProfileId]) => $profiles.find((p) => p.id === $activeProfileId)
)
