import { resetSelectedAccount } from '@core/account'
import { activeProfile, INITIAL_ACTIVE_PROFILE, IProfile, activeProfileId } from '@core/profile'
import { Platform } from '@lib/platform'

export function resetActiveProfile(): void {
    resetSelectedAccount()
    activeProfile.set(<IProfile>{ ...INITIAL_ACTIVE_PROFILE })
    activeProfileId.set(null)
    Platform.updateActiveProfile(null)
}
