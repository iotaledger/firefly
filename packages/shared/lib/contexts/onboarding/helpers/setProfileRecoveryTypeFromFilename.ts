import { seedvaultRegex, strongholdRegex } from '../constants'
import { ProfileRecoveryType } from '../enums'
import { updateOnboardingProfile } from '../stores'

export function setProfileRecoveryTypeFromFilename(filename: string): void {
    if (seedvaultRegex.test(filename)) {
        updateOnboardingProfile({ recoveryType: ProfileRecoveryType.SeedVault })
    } else if (strongholdRegex.test(filename)) {
        updateOnboardingProfile({ recoveryType: ProfileRecoveryType.Stronghold })
    }
}
