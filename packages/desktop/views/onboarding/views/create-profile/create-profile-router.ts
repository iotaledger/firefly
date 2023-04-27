import { CreateProfileType, onboardingProfile } from '@contexts/onboarding'
import { Router, Subrouter } from '@core/router'
import { get, writable } from 'svelte/store'
import {
    /* `CreateProfileRoute` is an enum that defines the different routes available in the create
    profile flow. It is used to keep track of the current route and to determine the next route
    to navigate to. */
    CreateProfileRoute,
} from './create-profile-route.enum'
import { CreateFromLedgerRouter, createFromLedgerRouter } from '../create-from-ledger'

export const createProfileRoute = writable<CreateProfileRoute>(undefined)
export const createProfileRouter = writable<CreateProfileRouter>(undefined)

export class CreateProfileRouter extends Subrouter<CreateProfileRoute> {
    constructor(parentRouter: Router<unknown>) {
        super(CreateProfileRoute.ChooseCreateProfileFlow, createProfileRoute, parentRouter)
    }

    next(): void {
        let nextRoute: CreateProfileRoute

        const _onboardingProfile = get(onboardingProfile)
        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case CreateProfileRoute.ChooseCreateProfileFlow:
                switch (_onboardingProfile.createProfileType) {
                    case CreateProfileType.Mnemonic:
                        nextRoute = CreateProfileRoute.CreateFromMnemonic
                        break
                    case CreateProfileType.Ledger:
                        createFromLedgerRouter.set(new CreateFromLedgerRouter(get(createProfileRouter)))
                        nextRoute = CreateProfileRoute.CreateFromLedger
                        break
                }
                break
            case CreateProfileRoute.CreateFromMnemonic:
            case CreateProfileRoute.CreateFromLedger:
                this.parentRouter.next()
                return
        }

        this.setNext(nextRoute)
    }
}
