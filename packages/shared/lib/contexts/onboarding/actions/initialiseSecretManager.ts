import { get } from 'svelte/store'

import { ProfileRecoveryType, ProfileSetupType } from '../enums'
import { onboardingProfile } from '../stores'

import { restoreBackupFromFile } from './restoreBackupFromFile'

export async function initialiseSecretManager(): Promise<void> {
    const _onboardingProfile = get(onboardingProfile)

    const profileSetupType = _onboardingProfile?.setupType
    const profileRecoveryType = _onboardingProfile?.recoveryType

    if (profileSetupType === ProfileSetupType.Recovered) {
        if (profileRecoveryType === ProfileRecoveryType.Stronghold) {
            await restoreBackupFromFile(
                _onboardingProfile?.importFile as Buffer,
                _onboardingProfile?.strongholdPassword
            )
        }
    }
}
