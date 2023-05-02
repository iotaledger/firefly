import { get, writable } from 'svelte/store'

import { onboardingProfile, OnboardingType } from '@contexts/onboarding'
import { ProfileType } from '@core/profile'
import { Subrouter } from '@core/router'

import { ProfileSetupRoute } from '../../enums'
import { onboardingRouter } from '../onboarding-router'

export const profileSetupRoute = writable<ProfileSetupRoute>(null)
export const profileSetupRouter = writable<ProfileSetupRouter>(null)

export class ProfileSetupRouter extends Subrouter<ProfileSetupRoute> {
    constructor() {
        super(ProfileSetupRoute.Setup, profileSetupRoute, get(onboardingRouter))
    }

    next(): void {
        let nextRoute: ProfileSetupRoute

        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case ProfileSetupRoute.Setup: {
                const onboardingType = get(onboardingProfile)?.onboardingType
                if (onboardingType === OnboardingType.Claim) {
                    nextRoute = ProfileSetupRoute.SetupClaimed
                } else if (onboardingType === OnboardingType.Create) {
                    nextRoute = ProfileSetupRoute.EnterName
                } else if (onboardingType === OnboardingType.Restore) {
                    nextRoute = ProfileSetupRoute.SetupRecovered
                }
                break
            }
            case ProfileSetupRoute.SetupClaimed:
            case ProfileSetupRoute.SetupRecovered: {
                const profileType = get(onboardingProfile)?.type
                if (profileType === ProfileType.Software) {
                    this.parentRouter.next()
                    return
                } else {
                    nextRoute = ProfileSetupRoute.EnterName
                    break
                }
            }
            case ProfileSetupRoute.EnterName: {
                this.parentRouter.next()
                return
            }
        }

        this.setNext(nextRoute)
    }
}
