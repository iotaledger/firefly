import { OnboardingType, onboardingProfile } from '@contexts/onboarding'
import { hasCompletedAppSetup } from '@core/app'
import { get, writable } from 'svelte/store'
import { Router } from '../../../shared/lib/core/router/classes'
import { appRouter } from '../../../shared/lib/core/router/routers/app-router'
import { OnboardingRoute } from './onboarding-route.enum'

export const onboardingRoute = writable<OnboardingRoute>(undefined)
export const onboardingRouter = writable<OnboardingRouter>(undefined)

export class OnboardingRouter extends Router<OnboardingRoute> {
    constructor() {
        super(getInitialRoute(), onboardingRoute)
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
                        nextRoute = OnboardingRoute.CreateProfile
                        break
                    }
                    case OnboardingType.Restore:
                    case OnboardingType.Claim:
                        nextRoute = OnboardingRoute.RestoreProfile
                        break
                }
                break
            }
            case OnboardingRoute.CreateProfile: {
                nextRoute = OnboardingRoute.CompleteOnboarding
                break
            }
            case OnboardingRoute.RestoreProfile: {
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
