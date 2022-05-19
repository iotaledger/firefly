import { activeProfile, activeProfileId, INITIAL_ACTIVE_PROFILE, IProfile } from '@core/profile'
import { Platform } from '@lib/platform'

export function resetActiveProfile(): void {
    activeProfile.set(<IProfile>{ ...INITIAL_ACTIVE_PROFILE })
    activeProfileId.set(null)
    Platform.updateActiveProfile(null)
}
