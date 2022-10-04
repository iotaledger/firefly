import { get } from 'svelte/store'

import { initialiseOnboardingRouters, OnboardingRoute, onboardingRouter } from '@core/router'

import { IOnboardingInitialisationOptions } from '../interfaces'
import { updateOnboardingProfile } from '../stores'

import { initialiseOnboardingProfile } from './initialiseOnboardingProfile'
import { logout } from '@core/profile'

export async function initialiseOnboarding(options: IOnboardingInitialisationOptions): Promise<void> {
    const { isDeveloperProfile, networkProtocol, networkType, resetRouters } = options

    await logout()

    initialiseOnboardingProfile(isDeveloperProfile, networkProtocol, true)

    if (networkType) {
        updateOnboardingProfile({ networkType })
    }

    if (resetRouters) {
        initialiseOnboardingRouters()
        const route = isDeveloperProfile ? OnboardingRoute.NetworkSetup : OnboardingRoute.ProfileSetup
        get(onboardingRouter).goTo(route)
    }
}
