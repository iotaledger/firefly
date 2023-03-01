import { get, writable } from 'svelte/store'

import { Subrouter } from '@core/router'

import { closeDrawer, DrawerId } from '@/auxiliary/drawer'
import { ProfileRoute } from '../../enums'
import { resetRouterWithDrawerDelay } from '../../utils'
import { dashboardRouter } from '../dashboard-router'

export const profileRoute = writable<ProfileRoute>(null)
export const profileRouter = writable<ProfileRouter>(null)

export class ProfileRouter extends Subrouter<ProfileRoute> {
    constructor() {
        super(ProfileRoute.Actions, profileRoute, get(dashboardRouter))
    }
    public next(): void {
        let nextRoute: ProfileRoute
        const currentRoute = get(this.routeStore)

        switch (currentRoute) {
            case ProfileRoute.Actions: {
                nextRoute = ProfileRoute.Settings
                break
            }
        }

        this.setNext(nextRoute)
    }

    previous(): void {
        if (this.history.length > 0) {
            super.previous()
        } else {
            this.closeDrawer()
        }
    }

    closeDrawer(): void {
        closeDrawer(DrawerId.Send)
        resetRouterWithDrawerDelay(get(profileRouter))
    }
}
