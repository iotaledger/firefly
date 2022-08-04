import { get } from 'svelte/store'

import { createNewAccount } from '@core/account'
import { login } from '@core/profile'

import { ProfileSetupType } from '../enums'
import { onboardingProfile } from '../stores'

import { addOnboardingProfile } from './addOnboardingProfile'
import { cleanupOnboarding } from './cleanupOnboarding'
import { initialiseSecretManager } from './initialiseSecretManager'

export async function completeOnboardingProcess(): Promise<void> {
    addOnboardingProfile()
    await initialiseSecretManager()
    await createNewAccount()
    const recoverAccounts = get(onboardingProfile)?.setupType !== ProfileSetupType.New
    void login(recoverAccounts)
    void cleanupOnboarding()
}
