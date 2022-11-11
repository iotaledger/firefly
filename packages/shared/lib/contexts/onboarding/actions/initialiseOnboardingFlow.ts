import { get } from 'svelte/store'

import { AppContext } from '@core/app/enums'
import { isPollingLedgerDeviceStatus, stopPollingLedgerNanoStatus } from '@core/ledger'
import { resetActiveProfile } from '@core/profile/actions'
import { destroyProfileManager, unsubscribeFromWalletApiEvents } from '@core/profile-manager'
import { AppRoute, appRouter, loginRouter, OnboardingRoute, onboardingRouter, routerManager } from '@core/router'

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
    unsubscribeFromWalletApiEvents()
    destroyProfileManager()

    const { isDeveloperProfile, networkProtocol, networkType } = options

    initialiseOnboardingProfile(isDeveloperProfile, networkProtocol, true)

    if (networkType) {
        updateOnboardingProfile({ networkType })
    }

    get(routerManager).resetRouterForAppContext(AppContext.Onboarding, true)
    const route = isDeveloperProfile ? OnboardingRoute.NetworkSetup : OnboardingRoute.ProfileSetup
    get(loginRouter).reset()
    get(onboardingRouter).goTo(route)
    get(appRouter).reset()
    get(appRouter).goTo(AppRoute.Onboarding)
}
