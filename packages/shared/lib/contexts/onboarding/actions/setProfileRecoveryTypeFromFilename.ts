import { STRONGHOLD_REGEX } from '../constants'
import { ProfileRecoveryType } from '../enums'
import { updateOnboardingProfile } from '../stores'

export function setProfileRecoveryTypeFromFilename(filename: string): void {
    if (STRONGHOLD_REGEX.test(filename)) {
        updateOnboardingProfile({ recoveryType: ProfileRecoveryType.Stronghold })
    }
}
