import { seedvaultRegex, strongholdRegex } from '../constants'
import { ProfileRecoveryType } from '../enums'
import { profileRecoveryType } from '../stores'

export function setProfileRecoveryTypeFromFilename(filename: string): void {
    if (seedvaultRegex.test(filename)) {
        profileRecoveryType.set(ProfileRecoveryType.SeedVault)
    } else if (strongholdRegex.test(filename)) {
        profileRecoveryType.set(ProfileRecoveryType.Stronghold)
    }
}
