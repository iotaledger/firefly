import { setStrongholdPassword } from '@core/wallet'
import { get } from 'svelte/store'

import { onboardingProfile, updateOnboardingProfile } from '../stores'

import { initialiseProfileManagerFromOnboardingProfile } from './initialiseProfileManagerFromOnboardingProfile'
import { resetOnboardingProfile } from './resetOnboardingProfile'

export async function resetOnboardingProfileWithAlreadyStoredMnemonic(): Promise<void> {
    await resetOnboardingProfile()
    await initialiseProfileManagerFromOnboardingProfile()
    await setStrongholdPassword(get(onboardingProfile)?.strongholdPassword)
    updateOnboardingProfile({ hasStoredMnemonic: false })
}
