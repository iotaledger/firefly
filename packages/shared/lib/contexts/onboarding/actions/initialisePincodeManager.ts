import { get } from 'svelte/store'

import { Platform } from '@lib/platform'

import { onboardingProfile } from '../stores'

/**
 * Sets the initial storage PIN using the Platform API.
 */
export async function initialisePincodeManager(pinInput: string): Promise<void> {
    await Platform.PincodeManager.set(get(onboardingProfile)?.id, pinInput)
}
