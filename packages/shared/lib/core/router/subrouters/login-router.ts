import { isLatestStrongholdVersion } from '@core/app'
import { activeProfile, ProfileType } from '@core/profile'
import { get, writable } from 'svelte/store'

import { Subrouter } from '../classes'
import { LoginRoute } from '../enums'
import { IRouterEvent } from '../interfaces'
import { appRouter } from '../routers'
import features from '@features/features'
import {
    UpdateStrongholdRouter,
    updateStrongholdRouter,
} from '../../../../../desktop/views/update-stronghold/update-stronghold-router'

export const loginRoute = writable<LoginRoute>(null)
export const loginRouter = writable<LoginRouter>(null)

export class LoginRouter extends Subrouter<LoginRoute> {
    constructor() {
        super(LoginRoute.SelectProfile, loginRoute, get(appRouter))
    }

    next(event?: IRouterEvent): void {
        let nextRoute: LoginRoute
        const currentRoute = get(this.routeStore)

        const requiresUpdate =
            get(activeProfile) &&
            get(activeProfile).type === ProfileType.Software &&
            !isLatestStrongholdVersion(get(activeProfile)?.strongholdVersion) &&
            features.onboarding.strongholdVersionCheck.enabled

        switch (currentRoute) {
            case LoginRoute.SelectProfile: {
                if (event?.shouldAddProfile) {
                    this.parentRouter.next(event)
                    return
                } else {
                    nextRoute = LoginRoute.EnterPin
                }
                break
            }
            case LoginRoute.EnterPin:
                if (requiresUpdate) {
                    updateStrongholdRouter.set(new UpdateStrongholdRouter(this))
                    nextRoute = LoginRoute.UpdateStronghold
                } else {
                    nextRoute = LoginRoute.LoadProfile
                }
                break
            case LoginRoute.UpdateStronghold:
                nextRoute = LoginRoute.LoadProfile
                break
            case LoginRoute.LoadProfile:
                this.parentRouter.next(event)
                return
        }

        this.setNext(nextRoute)
    }
}
