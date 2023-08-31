import { Router, Subrouter } from '@core/router'
import { get, writable } from 'svelte/store'
import { CompleteOnboardingRoute } from './complete-onboarding-route.enum'
import features from '@features/features'
import { onboardingProfile, OnboardingType } from '@contexts/onboarding'

export const completeOnboardingRoute = writable<CompleteOnboardingRoute>(undefined)
export const completeOnboardingRouter = writable<CompleteOnboardingRouter>(undefined)

export class CompleteOnboardingRouter extends Subrouter<CompleteOnboardingRoute> {
    constructor(parentRouter: Router<unknown>) {
        super(CompleteOnboardingRoute.EnterName, completeOnboardingRoute, parentRouter)
    }

    next(): void {
        let nextRoute: CompleteOnboardingRoute

        const currentRoute = get(this.routeStore)
        const onboardingType = get(onboardingProfile)?.onboardingType
        switch (currentRoute) {
            case CompleteOnboardingRoute.EnterName:
                nextRoute = CompleteOnboardingRoute.EnterPin
                break
            case CompleteOnboardingRoute.EnterPin:
                if (features.onboarding.balanceOverview.enabled && onboardingType === OnboardingType.Restore) {
                    nextRoute = CompleteOnboardingRoute.BalanceOverview
                } else {
                    nextRoute = CompleteOnboardingRoute.FinishOnboarding
                }
                break
            case CompleteOnboardingRoute.BalanceOverview:
                nextRoute = CompleteOnboardingRoute.FinishOnboarding
                break
            case CompleteOnboardingRoute.FinishOnboarding:
                this.parentRouter.next()
                return
        }

        this.setNext(nextRoute)
    }
}
