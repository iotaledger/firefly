import { get } from 'svelte/store'

import { createNewAccount } from '@core/account'
import { addNewProfile, loadPersistedProfileIntoActiveProfile, login, ProfileType } from '@core/profile'

import { ProfileRecoveryType, ProfileSetupType } from '../enums'
import { convertOnboardingProfileToPersistedProfile } from '../helpers'
import { onboardingProfile, updateOnboardingProfile } from '../stores'
import { cleanupOnboarding } from './cleanupOnboarding'
import { restoreBackupFromFile } from './restoreBackupFromFile'
import { verifyAndStoreMnemonic } from './verifyAndStoreMnemonic'

export async function completeOnboardingProcess(): Promise<void> {
    addOnboardingProfile()
    await initialiseSecretManager()
    await createNewAccount()
    const recoverAccounts = get(onboardingProfile)?.setupType !== ProfileSetupType.New
    void login(recoverAccounts)
    void cleanupOnboarding()
}

function addOnboardingProfile(): void {
    const _onboardingProfile = get(onboardingProfile)
    const newProfile = convertOnboardingProfileToPersistedProfile(_onboardingProfile)
    addNewProfile(newProfile)
    loadPersistedProfileIntoActiveProfile(_onboardingProfile?.id)
}

async function initialiseSecretManager(): Promise<void> {
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
