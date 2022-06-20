import { get } from 'svelte/store'

import { Platform } from '@lib/platform'
import { newProfile } from '@core/profile'
import { SetupType } from '@lib/typings/setup'
import { walletSetupType } from '@lib/wallet'

import { storeAndCleanMnemonic } from './storeAndCleanMnemonic'

/**
 * Handles the cleanup process for the protection segment of the onboarding flow.
 */
export async function cleanupProtectionOnboarding(pinInput: string): Promise<void> {
    await Platform.PincodeManager.set(get(newProfile)?.id, pinInput)
    // TODO: replace with new api when it is implemented
    // await setStoragePassword(pinInput)
    if (get(walletSetupType) === SetupType.Mnemonic) {
        await storeAndCleanMnemonic()
    }
}
