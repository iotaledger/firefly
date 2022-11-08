import { activeProfile, INITIAL_ACTIVE_PROFILE, IPersistedProfile, IProfile } from '@core/profile'
import { activeProfileId } from '@core/profile/stores'
import { Platform } from '@core/app'

export function setActiveProfile(persistedProfile: IPersistedProfile): void {
    activeProfile?.set(<IProfile>{ ...INITIAL_ACTIVE_PROFILE, ...persistedProfile })
    activeProfileId?.set(persistedProfile.id)
    Platform.updateActiveProfile(persistedProfile.id)
}
