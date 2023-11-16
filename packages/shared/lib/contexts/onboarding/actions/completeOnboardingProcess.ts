import { activeProfile, login } from '@core/profile'
import { get } from 'svelte/store'
import { OnboardingType } from '../enums'
import { onboardingProfile } from '../stores'
import { createNewProfileFromOnboardingProfile } from './createNewProfileFromOnboardingProfile'
import { showBalanceOverviewPopup } from '@contexts/dashboard/stores'
import { createNewAccount } from '@core/account'

export async function completeOnboardingProcess(): void {
    // if we already have an active profile
    // it means we are trying to load again after an error
    // and we don't need to add it again
    if (!get(activeProfile)?.id) {
        createNewProfileFromOnboardingProfile()
    }

    const onboardingType = get(onboardingProfile)?.onboardingType
    const shouldRecoverAccounts = onboardingType === OnboardingType.Restore || onboardingType === OnboardingType.Claim
    showBalanceOverviewPopup.set(shouldRecoverAccounts)
    await createNewAccount()
    void login({ isFromOnboardingFlow: true, shouldRecoverAccounts })

    onboardingProfile.set(undefined)
}
