import { stopPollingLedgerNanoStatus } from '@core/ledger/actions'
import { isPollingLedgerDeviceStatus } from '@core/ledger/stores'
import { NETWORK_METADATA_MAP } from '@core/network'
import { destroyProfileManager, unsubscribeFromWalletApiEvents } from '@core/profile-manager'
import { resetActiveProfile } from '@core/profile/actions'
import { get } from 'svelte/store'
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

    const { isDeveloperProfile, networkId } = options

    await initialiseOnboardingProfile(isDeveloperProfile, true)

    if (networkId) {
        const network = NETWORK_METADATA_MAP?.[networkId]
        updateOnboardingProfile({ network })
    }
}
