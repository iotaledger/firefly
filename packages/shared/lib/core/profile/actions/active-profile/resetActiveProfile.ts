import { activeProfile, activeProfileId, INITIAL_ACTIVE_PROFILE, IProfile } from '@core/profile'
import { get } from 'svelte/store'

export function resetActiveProfile(): void {
    const { lastUsedAccountIndex } = get(activeProfile)
    activeProfile.set(<IProfile>{ ...INITIAL_ACTIVE_PROFILE, lastUsedAccountIndex })
    activeProfileId.set(null)
}
