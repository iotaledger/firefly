import { storeMnemonic, verifyMnemonic } from '@core/secret-manager'
import { get } from 'svelte/store'
import { onboardingProfile } from '../stores'

/**
 * Verifies, stores, then clears the mnemonic used in the onboarding flow.
 */
export async function verifyAndStoreMnemonic(): Promise<void> {
    // TODO(2.0) This shouldn't use the onboarding profile always
    const mnemonic = get(onboardingProfile)?.mnemonic?.join(' ') ?? ''

    console.log("verifying...")
    await verifyMnemonic(mnemonic)
    console.log("verified...")

    console.log("storing...")
    await storeMnemonic(mnemonic)
    console.log("stored...")
}
