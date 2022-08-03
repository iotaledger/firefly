import { get } from 'svelte/store'

import { clearStrongholdPassword } from '@core/profile-manager'

import { onboardingProfile, updateOnboardingProfile } from '../stores'

export async function clearStrongholdPasswordForOnboarding(): Promise<void> {
    if (get(onboardingProfile)?.strongholdPassword) {
        await clearStrongholdPassword()
        updateOnboardingProfile({ strongholdPassword: null })
    }
}
