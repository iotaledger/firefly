import { get, writable } from 'svelte/store'

import { hasUserClaimedRewards, onboardingProfile } from '@contexts/onboarding'

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
                /**
                 * NOTE: It is possible that the user has continued from the claim rewards
                 * view without actually claiming any rewards, therefore it doesn't make
                 * sense to show this page if that is the case.
                 */
                if (hasUserClaimedRewards(get(onboardingProfile)?.shimmerClaimingAccounts)) {
                    nextRoute = ShimmerClaimingRoute.Success
                    break
                } else {
                    this.parentRouter.next()
                    return
                }
            case ShimmerClaimingRoute.Success:
                this.parentRouter.next()
                return
        }

        this.setNext(nextRoute)
    }
}
