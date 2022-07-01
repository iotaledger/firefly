import { get } from 'svelte/store'

import { Platform } from '@lib/platform'
import { newProfile, updateNewProfile } from '../stores'
import { SetupType } from '@lib/typings/setup'
import { walletSetupType } from '@lib/wallet'

import { storeAndCleanMnemonic } from './storeAndCleanMnemonic'
import { generateRandomId } from '@lib/utils'

/**
 * Handles the cleanup process for the protection segment of the onboarding flow.
 */
export async function cleanupProtectionOnboarding(pinInput: string): Promise<void> {
    if (!get(newProfile)?.id) {
        updateNewProfile({ id: generateRandomId() })
    }
    await Platform.PincodeManager.set(get(newProfile)?.id, pinInput)
    // TODO: replace with new api when it is implemented
    // await setStoragePassword(pinInput)
    if (get(walletSetupType) === SetupType.Mnemonic) {
        await storeAndCleanMnemonic()
    }
}
