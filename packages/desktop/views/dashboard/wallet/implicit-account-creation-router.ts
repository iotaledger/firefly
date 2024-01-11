import { get, writable } from 'svelte/store'
import { Router } from '../../../../shared/lib/core/router/classes'
import { ImplicitAccountCreationRoute } from './implicit-account-creation.enum'
import { appRouter } from '@core/router'

export const implicitAccountCreationRouter = writable<ImplicitAccountCreationRouter>(null)
export const implicitAccountCreationRoute = writable<ImplicitAccountCreationRoute>(null)

export class ImplicitAccountCreationRouter extends Router<ImplicitAccountCreationRoute> {
    constructor() {
        super(ImplicitAccountCreationRoute.Init, implicitAccountCreationRoute)
    }

    next(): void {
        let nextRoute: ImplicitAccountCreationRoute

        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case ImplicitAccountCreationRoute.Init: {
                nextRoute = ImplicitAccountCreationRoute.OneTimeDeposit
                break
            }
            case ImplicitAccountCreationRoute.OneTimeDeposit: {
                nextRoute = ImplicitAccountCreationRoute.FundConfirmation
                break
            }
            case ImplicitAccountCreationRoute.FundConfirmation: {
                nextRoute = ImplicitAccountCreationRoute.AccountCreation
                break
            }
            case ImplicitAccountCreationRoute.AccountCreation: {
                get(appRouter).next()
                return
            }
        }
        this.setNext(nextRoute)
    }
}
