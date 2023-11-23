import { get } from 'svelte/store'

import { stopPollingLedgerNanoStatus } from '@core/ledger/actions'
import { isPollingLedgerDeviceStatus } from '@core/ledger/stores'
import { getDefaultPersistedNetwork } from '@core/network/utils'
import { clearProfileFromMemory, unsubscribeFromWalletApiEvents } from '@core/profile-manager/actions'
import { resetActiveProfile } from '@core/profile/actions'

import { IOnboardingInitialisationOptions } from '../interfaces'
import { updateOnboardingProfile } from '../stores'
import { deleteOnboardingProfile } from './deleteOnboardingProfile'
import { initialiseOnboardingProfile } from './initialiseOnboardingProfile'

export async function initialiseOnboardingFlow(options: IOnboardingInitialisationOptions): Promise<void> {
    resetActiveProfile()

    await deleteOnboardingProfile()

    if (get(isPollingLedgerDeviceStatus)) {
        stopPollingLedgerNanoStatus()
    }
    await unsubscribeFromWalletApiEvents()
    await clearProfileFromMemory()

    const { isDeveloperProfile, networkId } = options

    await initialiseOnboardingProfile(isDeveloperProfile, true)

    if (networkId) {
        const network = getDefaultPersistedNetwork(networkId)
        updateOnboardingProfile({ network })
    }
}
