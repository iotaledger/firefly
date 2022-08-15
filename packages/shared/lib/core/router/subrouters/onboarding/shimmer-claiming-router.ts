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
        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case ShimmerClaimingRoute.ClaimRewards:
                this.parentRouter.next()
                break
        }
    }
}
