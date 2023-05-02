import { STRONGHOLD_REGEX } from '../constants'
import { RestoreProfileType } from '../enums'
import { updateOnboardingProfile } from '../stores'

export function setProfileRecoveryTypeFromFilename(filename: string): void {
    if (STRONGHOLD_REGEX.test(filename)) {
        updateOnboardingProfile({ restoreProfileType: RestoreProfileType.Stronghold })
    }
}
