import { clearStrongholdPassword } from '@core/secret-manager'
import { get } from 'svelte/store'

import { onboardingProfile, updateOnboardingProfile } from '../stores'

export async function clearStrongholdPasswordForOnboarding(): Promise<void> {
    if (get(onboardingProfile)?.strongholdPassword) {
        await clearStrongholdPassword()
        updateOnboardingProfile({ strongholdPassword: undefined })
    }
}
