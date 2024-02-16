import { Router, Subrouter } from '@core/router'
import { get, writable } from 'svelte/store'
import { CompleteOnboardingRoute } from './complete-onboarding-route.enum'

export const completeOnboardingRoute = writable<CompleteOnboardingRoute>(undefined)
export const completeOnboardingRouter = writable<CompleteOnboardingRouter>(undefined)

export class CompleteOnboardingRouter extends Subrouter<CompleteOnboardingRoute> {
    constructor(parentRouter: Router<unknown>) {
        super(CompleteOnboardingRoute.EnterName, completeOnboardingRoute, parentRouter)
    }

    next(): void {
        let nextRoute: CompleteOnboardingRoute

        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case CompleteOnboardingRoute.EnterName:
                nextRoute = CompleteOnboardingRoute.EnterPin
                break
            case CompleteOnboardingRoute.EnterPin:
                nextRoute = CompleteOnboardingRoute.FinishOnboarding
                break
            case CompleteOnboardingRoute.FinishOnboarding:
                this.parentRouter.next()
                return
        }

        this.setNext(nextRoute)
    }
}
