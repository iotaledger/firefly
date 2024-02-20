import { CreateProfileType, onboardingProfile } from '@contexts/onboarding'
import { Router, Subrouter } from '@core/router'
import { get, writable } from 'svelte/store'
import { CreateFromLedgerRouter, createFromLedgerRouter } from '../create-from-ledger'
import { CreateFromMnemonicRouter, createFromMnemonicRouter } from '../create-from-mnemonic'
import { CreateProfileRoute } from './create-profile-route.enum'

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
                        createFromMnemonicRouter.set(new CreateFromMnemonicRouter(get(createProfileRouter)))
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
