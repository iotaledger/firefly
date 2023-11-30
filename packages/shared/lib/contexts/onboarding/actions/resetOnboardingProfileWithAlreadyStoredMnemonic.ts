import { setStrongholdPassword } from '@core/wallet'
import { get } from 'svelte/store'

import { onboardingProfile, updateOnboardingProfile } from '../stores'

import { initialiseOnboardingProfileWithSeretManager } from './initialiseProfileManagerFromOnboardingProfile'
import { resetOnboardingProfile } from './resetOnboardingProfile'

export async function resetOnboardingProfileWithAlreadyStoredMnemonic(): Promise<void> {
    await resetOnboardingProfile()
    await initialiseOnboardingProfileWithSeretManager()
    await setStrongholdPassword(get(onboardingProfile)?.strongholdPassword)
    updateOnboardingProfile({ hasStoredMnemonic: false })
}
