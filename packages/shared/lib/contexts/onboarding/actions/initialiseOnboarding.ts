import { stopPollingLedgerNanoStatus } from '@core/ledger'
import { destroyProfileManager } from '@core/profile-manager'
import { initialiseOnboardingRouters } from '@core/router'

import { IOnboardingInitialisationOptions } from '../interfaces'
import { updateOnboardingProfile } from '../stores'

import { initialiseOnboardingProfile } from './initialiseOnboardingProfile'

export function initialiseOnboarding(options: IOnboardingInitialisationOptions): void {
    const { isDeveloperProfile, networkProtocol, networkType, resetProfileManagers, resetRouters } = options

    if (resetProfileManagers) {
        /**
         * CAUTION: We MUST stop polling the Ledger
         * Nano status because it uses the underlying
         * profile manager, which if reset will become
         * null or undefined.
         */
        stopPollingLedgerNanoStatus()
        destroyProfileManager()
    }

    initialiseOnboardingProfile(isDeveloperProfile, networkProtocol, true)

    if (networkType) {
        updateOnboardingProfile({ networkType })
    }

    if (resetRouters) {
        initialiseOnboardingRouters()
    }
}
