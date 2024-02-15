import { OnboardingType, onboardingProfile } from '@contexts/onboarding'
import { hasCompletedAppSetup } from '@core/app'
import { get, writable } from 'svelte/store'
import {
    Router,
    appRouter,
    CompleteOnboardingRouter,
    completeOnboardingRouter,
    CreateProfileRouter,
    createProfileRouter,
    NetworkSetupRouter,
    networkSetupRouter,
    RestoreProfileRouter,
    restoreProfileRouter,
} from '@core/router'
import { OnboardingRoute } from './onboarding-route.enum'

export const onboardingRoute = writable<OnboardingRoute>(undefined)
export const onboardingRouter = writable<OnboardingRouter>(undefined)

export class OnboardingRouter extends Router<OnboardingRoute> {
    constructor() {
        super(getInitialRoute(), onboardingRoute)
        networkSetupRouter.set(new NetworkSetupRouter(this))
    }

    next(): void {
        let nextRoute: OnboardingRoute

        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case OnboardingRoute.Welcome: {
                nextRoute = OnboardingRoute.NetworkSetup
                break
            }
            case OnboardingRoute.NetworkSetup: {
                nextRoute = OnboardingRoute.ChooseOnboardingFlow
                break
            }
            case OnboardingRoute.ChooseOnboardingFlow: {
                switch (get(onboardingProfile)?.onboardingType) {
                    case OnboardingType.Create: {
                        createProfileRouter.set(new CreateProfileRouter(get(onboardingRouter)))
                        nextRoute = OnboardingRoute.CreateProfile
                        break
                    }
                    case OnboardingType.Restore:
                    case OnboardingType.Claim:
                        restoreProfileRouter.set(new RestoreProfileRouter(get(onboardingRouter)))
                        nextRoute = OnboardingRoute.RestoreProfile
                        break
                }
                break
            }
            case OnboardingRoute.CreateProfile:
            case OnboardingRoute.RestoreProfile: {
                completeOnboardingRouter.set(new CompleteOnboardingRouter(get(onboardingRouter)))
                nextRoute = OnboardingRoute.CompleteOnboarding
                break
            }
            case OnboardingRoute.CompleteOnboarding: {
                get(appRouter).next()
                return
            }
        }

        this.setNext(nextRoute)
    }

    previous(): void {
        if (this.history.length > 0) {
            super.previous()
        } else {
            get(appRouter).previous()
        }
    }
}

function getInitialRoute(): OnboardingRoute {
    if (get(hasCompletedAppSetup)) {
        return OnboardingRoute.NetworkSetup
    } else {
        return OnboardingRoute.Welcome
    }
}
