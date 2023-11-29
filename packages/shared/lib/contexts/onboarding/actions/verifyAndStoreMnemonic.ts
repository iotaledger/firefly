import { storeMnemonic, verifyMnemonic } from '@core/secret-manager'
import { get } from 'svelte/store'
import { onboardingProfile } from '../stores'

/**
 * Verifies, stores, then clears the mnemonic used in the onboarding flow.
 */
export async function verifyAndStoreMnemonic(): Promise<void> {
    const mnemonic = get(onboardingProfile)?.mnemonic?.join(' ') ?? ''

    await verifyMnemonic(mnemonic)
    await storeMnemonic(mnemonic)
}
