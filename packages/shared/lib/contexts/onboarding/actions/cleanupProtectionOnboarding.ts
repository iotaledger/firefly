import { get } from 'svelte/store'

import { Platform } from '@lib/platform'

import { ProfileRecoveryType } from '../enums'
import { iotaProfileManager, mnemonic, onboardingProfile, profileRecoveryType } from '../stores'
import { storeAndCleanMnemonic } from './storeAndCleanMnemonic'

/**
 * Handles the cleanup process for the protection segment of the onboarding flow.
 */
export async function cleanupProtectionOnboarding(pinInput: string): Promise<void> {
    await Platform.PincodeManager.set(get(onboardingProfile)?.id, pinInput)
    // TODO: replace with new api when it is implemented
    // await setStoragePassword(pinInput)
    if (get(profileRecoveryType) === ProfileRecoveryType.Mnemonic) {
        const _iotaProfileManager = get(iotaProfileManager)
        if (_iotaProfileManager) {
            const _mnemonic = get(mnemonic).join(' ')

            await _iotaProfileManager?.verifyMnemonic(_mnemonic)
            await _iotaProfileManager?.storeMnemonic(_mnemonic)
        }

        await storeAndCleanMnemonic()
    }
}
