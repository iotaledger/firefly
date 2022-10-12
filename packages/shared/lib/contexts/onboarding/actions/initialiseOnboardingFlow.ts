import { get } from 'svelte/store'

import { isPollingLedgerDeviceStatus, stopPollingLedgerNanoStatus } from '@core/ledger'
import { destroyProfileManager, unsubscribeFromWalletApiEvents } from '@core/profile-manager'
import { AppRoute, appRouter, initialiseOnboardingRouters, OnboardingRoute, onboardingRouter } from '@core/router'

import { IOnboardingInitialisationOptions } from '../interfaces'
import { updateOnboardingProfile } from '../stores'

import { deleteOnboardingProfile } from './deleteOnboardingProfile'
import { initialiseOnboardingProfile } from './initialiseOnboardingProfile'

export async function initialiseOnboardingFlow(options: IOnboardingInitialisationOptions): Promise<void> {
    await deleteOnboardingProfile()

    if (get(isPollingLedgerDeviceStatus)) {
        stopPollingLedgerNanoStatus()
    }
    unsubscribeFromWalletApiEvents()
    destroyProfileManager()

    const { isDeveloperProfile, networkProtocol, networkType } = options

    initialiseOnboardingProfile(isDeveloperProfile, networkProtocol, true)

    if (networkType) {
        updateOnboardingProfile({ networkType })
    }

    initialiseOnboardingRouters()
    const route = isDeveloperProfile ? OnboardingRoute.NetworkSetup : OnboardingRoute.ProfileSetup
    get(onboardingRouter).goTo(route)
    get(appRouter).reset()
    get(appRouter).goTo(AppRoute.Onboarding)
}
