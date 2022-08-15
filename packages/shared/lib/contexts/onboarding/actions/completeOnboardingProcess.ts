import { get } from 'svelte/store'

import { createNewAccount } from '@core/account'
import { login } from '@core/profile'

import { ProfileSetupType } from '../enums'
import { onboardingProfile } from '../stores'

import { addOnboardingProfile } from './addOnboardingProfile'
import { cleanupOnboarding } from './cleanupOnboarding'

export async function completeOnboardingProcess(): Promise<void> {
    addOnboardingProfile()

    const shouldCreateNewAccount = get(onboardingProfile)?.setupType !== ProfileSetupType.Claimed
    if (shouldCreateNewAccount) {
        /**
         * NOTE: If recovering from a Stronghold that already contains
         * at least one account, calling this function will cause
         * an "AccountAliasAlreadyExists" error from wallet-rs. This
         * error does NOT cause side-effects while creating a profile.
         */
        await createNewAccount()
    }

    const recoverAccounts = get(onboardingProfile)?.setupType === ProfileSetupType.Recovered
    void login(recoverAccounts)

    void cleanupOnboarding()
}
