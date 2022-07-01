import { Platform } from '@lib/platform'
import { SetupType } from '@lib/typings/setup'
import { walletSetupType } from '@lib/wallet'
import { get } from 'svelte/store'
import { newProfile } from '../stores'
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
