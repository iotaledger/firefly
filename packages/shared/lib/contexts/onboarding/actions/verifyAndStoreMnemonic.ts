import { get } from 'svelte/store'

import { storeMnemonic, verifyMnemonic } from '@core/profile-manager'

import { onboardingProfile, updateOnboardingProfile } from '../stores'

/**
 * Verifies, stores, then clears the mnemonic used in the onboarding flow.
 */
export async function verifyAndStoreMnemonic(): Promise<void> {
    const mnemonic = get(onboardingProfile)?.mnemonic?.join(' ')

    await verifyMnemonic(mnemonic)
    await storeMnemonic(mnemonic)

    /**
     * CAUTION: This side-effect is here to ensure that the mnemonic
     * is cleaned up after being stored in the Stronghold.
     */
    updateOnboardingProfile({ hasStoredMnemonic: true, mnemonic: null })
}
