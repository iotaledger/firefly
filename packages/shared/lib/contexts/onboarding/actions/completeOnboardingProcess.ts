import { get } from 'svelte/store'

import { createNewAccount } from '@core/account'
import { addNewProfile, loadPersistedProfileIntoActiveProfile, login, ProfileType } from '@core/profile'

import { ProfileRecoveryType, ProfileSetupType } from '../enums'
import { convertOnboardingProfileToPersistedProfile } from '../helpers'
import { onboardingProfile } from '../stores'
import { cleanupOnboarding } from './cleanupOnboarding'
import { restoreBackupFromFile } from './restoreBackupFromFile'
import { verifyAndStoreMnemonic } from './verifyAndStoreMnemonic'

export async function completeOnboardingProcess(): Promise<void> {
    // This is the last screen in onboarding for all flows i.e., if you create a new wallet or import stronghold
    // When this component mounts, ensure that the profile is persisted in the local storage.
    const newProfile = convertOnboardingProfileToPersistedProfile(get(onboardingProfile))
    addNewProfile(newProfile)
    loadPersistedProfileIntoActiveProfile(get(onboardingProfile)?.id)

    const profileType = get(onboardingProfile)?.type
    const profileSetupType = get(onboardingProfile)?.setupType
    const profileRecoveryType = get(onboardingProfile)?.recoveryType

    if (profileSetupType === ProfileSetupType.New) {
        if (profileType === ProfileType.Software) {
            await verifyAndStoreMnemonic()
        }
    } else if (profileSetupType === ProfileSetupType.Recovered) {
        if (profileRecoveryType === ProfileRecoveryType.Mnemonic) {
            await verifyAndStoreMnemonic()
        } else if (profileRecoveryType === ProfileRecoveryType.Stronghold) {
            await restoreBackupFromFile(
                get(onboardingProfile)?.importFile as Buffer,
                get(onboardingProfile)?.strongholdPassword
            )
        }
    }

    await createNewAccount()
    const recoverAccounts = profileSetupType !== ProfileSetupType.New
    void login(recoverAccounts)
    void cleanupOnboarding()
}
