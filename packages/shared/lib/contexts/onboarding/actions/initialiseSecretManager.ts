import { get } from 'svelte/store'

import { ProfileType } from '@core/profile'

import { ProfileRecoveryType, ProfileSetupType } from '../enums'
import { onboardingProfile, updateOnboardingProfile } from '../stores'

import { restoreBackupFromFile } from './restoreBackupFromFile'
import { verifyAndStoreMnemonic } from './verifyAndStoreMnemonic'

export async function initialiseSecretManager(): Promise<void> {
    const _onboardingProfile = get(onboardingProfile)

    const profileType = _onboardingProfile?.type
    const profileSetupType = _onboardingProfile?.setupType
    const profileRecoveryType = _onboardingProfile?.recoveryType

    if (profileSetupType === ProfileSetupType.New) {
        if (profileType === ProfileType.Software) {
            if (_onboardingProfile?.mnemonic) {
                await verifyAndStoreMnemonic()
                updateOnboardingProfile({ mnemonic: null })
            }
        }
    } else if (profileSetupType === ProfileSetupType.Recovered) {
        if (profileRecoveryType === ProfileRecoveryType.Mnemonic) {
            if (_onboardingProfile?.mnemonic) {
                await verifyAndStoreMnemonic()
                updateOnboardingProfile({ mnemonic: null })
            }
        } else if (profileRecoveryType === ProfileRecoveryType.Stronghold) {
            await restoreBackupFromFile(
                _onboardingProfile?.importFile as Buffer,
                _onboardingProfile?.strongholdPassword
            )
        }
    }
}
