import { get, writable } from 'svelte/store'

import { ShimmerClaimingRoute } from '../../enums'
import { onboardingRouter } from '../../onboarding-router'
import { Subrouter } from '../subrouter'

export const shimmerClaimingRoute = writable<ShimmerClaimingRoute>(null)
export const shimmerClaimingRouter = writable<ShimmerClaimingRouter>(null)

export class ShimmerClaimingRouter extends Subrouter<ShimmerClaimingRoute> {
    constructor() {
        super(ShimmerClaimingRoute.ClaimRewards, shimmerClaimingRoute, get(onboardingRouter))
    }

    next(): void {
        let nextRoute: ShimmerClaimingRoute

        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case ShimmerClaimingRoute.ClaimRewards:
                nextRoute = ShimmerClaimingRoute.Success
                break
            case ShimmerClaimingRoute.Success:
                this.parentRouter.next()
                break
        }

        this.setNext(nextRoute)
    }
}
