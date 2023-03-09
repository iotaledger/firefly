import { get } from 'svelte/store'

import { stopPollingLedgerNanoStatus } from '@core/ledger/actions'
import { isPollingLedgerDeviceStatus } from '@core/ledger/stores'
import { resetActiveProfile } from '@core/profile/actions'
import { destroyProfileManager, unsubscribeFromWalletApiEvents } from '@core/profile-manager'

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
    await destroyProfileManager()

    const { isDeveloperProfile, networkProtocol, networkType } = options

    await initialiseOnboardingProfile(isDeveloperProfile, networkProtocol, true)

    if (networkType) {
        updateOnboardingProfile({ networkType })
    }
}
