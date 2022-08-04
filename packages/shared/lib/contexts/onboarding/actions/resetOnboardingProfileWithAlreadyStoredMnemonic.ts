import { get } from 'svelte/store'

import { removeProfileFolder } from '@core/profile'
import { destroyProfileManager, setStrongholdPassword } from '@core/profile-manager'

import { onboardingProfile, updateOnboardingProfile } from '../stores'
import { initialiseOnboardingProfile, initialiseProfileManagerFromOnboardingProfile } from './'

export async function resetOnboardingProfileWithAlreadyStoredMnemonic(): Promise<void> {
    const onboardingProfileData = get(onboardingProfile)
    destroyProfileManager()
    await removeProfileFolder(onboardingProfileData?.id)
    await initialiseOnboardingProfile(onboardingProfileData?.isDeveloperProfile)
    updateOnboardingProfile({ ...onboardingProfileData })
    await initialiseProfileManagerFromOnboardingProfile()
    await setStrongholdPassword(onboardingProfileData?.strongholdPassword)
    updateOnboardingProfile({ hasStoredMnemonic: false })
}
