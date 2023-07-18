import { get } from 'svelte/store'
import { onboardingProfile, updateOnboardingProfile } from '../stores'
import { storeMnemonic, verifyMnemonic } from '@core/profile-manager'
import { isMobile } from '@core/app/stores'

/**
 * Verifies, stores, then clears the mnemonic used in the onboarding flow.
 */
export async function verifyAndStoreMnemonic(): Promise<void> {
    const mnemonic = get(onboardingProfile)?.mnemonic?.join(' ') ?? ''

    await verifyMnemonic(mnemonic)
    await storeMnemonic(mnemonic)

    if (isMobile()) {
        updateOnboardingProfile({ hasStoredMnemonic: true, mnemonic: undefined })
    }
}
