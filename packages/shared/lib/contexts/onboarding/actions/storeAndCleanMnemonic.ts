import { get } from 'svelte/store'

import { storeMnemonic, verifyMnemonic } from '@core/profile-manager'

import { mnemonic } from '../stores'

/**
 * Verifies, stores, then clears the mnemonic used in the onboarding flow.
 */
export async function storeAndCleanMnemonic(): Promise<void> {
    const _mnemonic = get(mnemonic).join(' ')

    await verifyMnemonic(_mnemonic)
    await storeMnemonic(_mnemonic)

    mnemonic.set(null)
}
