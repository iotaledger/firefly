import { activeProfile, activeProfileId, INITIAL_ACTIVE_PROFILE, IProfile } from '@core/profile'
import { Platform } from '@lib/platform'
import { get } from 'svelte/store'

export function resetActiveProfile(): void {
    const { lastUsedAccountId } = get(activeProfile)
    activeProfile.set(<IProfile>{ ...INITIAL_ACTIVE_PROFILE, lastUsedAccountId })
    activeProfileId.set(null)
    Platform.updateActiveProfile(null)
}
