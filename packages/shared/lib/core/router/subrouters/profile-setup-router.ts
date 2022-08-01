import { get, writable } from 'svelte/store'

import { onboardingProfile, ProfileRecoveryType, ProfileSetupType } from '@contexts/onboarding'

import { ProfileSetupRoute } from '../enums'
import { onboardingRouter } from '../onboarding-router'
import { Subrouter } from './subrouter'

export const profileSetupRoute = writable<ProfileSetupRoute>(null)
export const profileSetupRouter = writable<ProfileSetupRouter>(null)

export class ProfileSetupRouter extends Subrouter<ProfileSetupRoute> {
    constructor() {
        super(ProfileSetupRoute.Setup, profileSetupRoute, get(onboardingRouter))
    }

    next(): void {
        let nextRoute: ProfileSetupRoute

        const _onboardingProfile = get(onboardingProfile)
        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case ProfileSetupRoute.Setup: {
                const setupType = _onboardingProfile?.setupType
                if (setupType) {
                    if (setupType === ProfileSetupType.Claimed) {
                        nextRoute = ProfileSetupRoute.SetupClaimed
                    } else if (setupType === ProfileSetupType.New) {
                        nextRoute = ProfileSetupRoute.SetupNew
                    } else if (setupType === ProfileSetupType.Restored) {
                        nextRoute = ProfileSetupRoute.SetupRecovered
                    }
                }
                break
            }
            case ProfileSetupRoute.SetupClaimed:
            case ProfileSetupRoute.SetupRecovered: {
                const recoveryType = _onboardingProfile?.recoveryType
                if (recoveryType) {
                    if (
                        recoveryType === ProfileRecoveryType.Mnemonic ||
                        recoveryType === ProfileRecoveryType.Stronghold
                    ) {
                        this.parentRouter.next()
                    } else if (recoveryType === ProfileRecoveryType.Ledger) {
                        nextRoute = ProfileSetupRoute.EnterName
                    }
                }
                break
            }
            case ProfileSetupRoute.SetupNew:
                nextRoute = ProfileSetupRoute.EnterName
                break
            case ProfileSetupRoute.EnterName: {
                this.parentRouter.next()
                break
            }
        }

        this.setNext(nextRoute)
    }
}
