import { derived, Readable } from 'svelte/store'
import { activeProfile } from './active-profile.store'
import { IPersistedNetwork } from '@core/network'

export const profileNetwork: Readable<IPersistedNetwork | undefined> = derived(
    activeProfile,
    ($activeProfile) => $activeProfile?.network
)
