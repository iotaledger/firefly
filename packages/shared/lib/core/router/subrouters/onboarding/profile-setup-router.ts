import { get, writable } from 'svelte/store'

import { ProfileType } from '@core/profile'
import { onboardingProfile, ProfileSetupType } from '@contexts/onboarding'

import { Subrouter } from '../../classes'
import { ProfileSetupRoute } from '../../enums'
import { onboardingRouter } from '../../routers'

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
                const setupType = get(onboardingProfile)?.setupType
                if (setupType === ProfileSetupType.Claimed) {
                    nextRoute = ProfileSetupRoute.SetupClaimed
                } else if (setupType === ProfileSetupType.New) {
                    nextRoute = ProfileSetupRoute.SetupNew
                } else if (setupType === ProfileSetupType.Recovered) {
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
            case ProfileSetupRoute.SetupNew:
                nextRoute = ProfileSetupRoute.EnterName
                break
            case ProfileSetupRoute.EnterName: {
                this.parentRouter.next()
                return
            }
        }

        this.setNext(nextRoute)
    }
}
