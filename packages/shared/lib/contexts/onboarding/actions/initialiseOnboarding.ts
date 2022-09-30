import { stopPollingLedgerNanoStatus } from '@core/ledger'
import { destroyProfileManager } from '@core/profile-manager'
import { initialiseOnboardingRouters } from '@core/router'

import { IOnboardingInitialisationOptions } from '../interfaces'
import { updateOnboardingProfile } from '../stores'

import { initialiseOnboardingProfile } from './initialiseOnboardingProfile'
import { NetworkProtocol, NetworkType } from '@core/network'

export function initialiseOnboarding(options: IOnboardingInitialisationOptions): void {
    const { isDeveloperProfile, networkProtocol, networkType, resetProfileManagers, resetRouters } = options

    if (resetRouters) {
        initialiseOnboardingRouters()
    }

    if (resetProfileManagers) {
        destroyProfileManager()
        stopPollingLedgerNanoStatus()
    }

    initialiseOnboardingProfile(isDeveloperProfile, networkProtocol, true)

    if (networkType) {
        updateOnboardingProfile({ networkType })
    }
}

export function initialiseOnboardingForNormalProfile(): void {
    initialiseOnboarding({
        isDeveloperProfile: false,
        networkProtocol: NetworkProtocol.Shimmer,
        networkType: NetworkType.Mainnet,
        resetProfileManagers: true,
        resetRouters: true,
    })
}

export function initialiseOnboardingForDeveloperProfile(): void {
    initialiseOnboarding({
        isDeveloperProfile: true,
        networkProtocol: NetworkProtocol.Shimmer,
        resetProfileManagers: true,
        resetRouters: true,
    })
}
