import { activeProfile, activeProfileId, INITIAL_ACTIVE_PROFILE, IProfile } from '@core/profile'
import { Platform } from '@core/app'
import { get } from 'svelte/store'

export function resetActiveProfile(): void {
    const { lastUsedWalletId } = get(activeProfile)
    activeProfile.set(<IProfile>{ ...INITIAL_ACTIVE_PROFILE, lastUsedWalletId })
    activeProfileId.set(null)
    Platform.updateActiveProfile(null)
}
