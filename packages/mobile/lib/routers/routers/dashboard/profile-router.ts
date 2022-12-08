import { get, writable } from 'svelte/store'

import { Subrouter } from '@core/router'

import { ProfileRoute } from '../../enums'
import { IProfileRouterEvent } from '../../interfaces'
import { resetRouterWithDrawerDelay } from '../../utils'
import { dashboardRouter } from '../dashboard-router'

export const profileRoute = writable<ProfileRoute>(null)
export const profileRouter = writable<ProfileRouter>(null)

export class ProfileRouter extends Subrouter<ProfileRoute> {
    constructor() {
        super(ProfileRoute.Actions, profileRoute, get(dashboardRouter))
    }
    public next(event: IProfileRouterEvent = {}): void {
        const { settings } = event

        let nextRoute: ProfileRoute
        const currentRoute = get(this.routeStore)

        switch (currentRoute) {
            case ProfileRoute.Actions: {
                if (settings) {
                    nextRoute = ProfileRoute.Settings
                }
                break
            }
        }

        this.setNext(nextRoute)
    }

    closeDrawer(): void {
        get(dashboardRouter).previous()
        resetRouterWithDrawerDelay(get(profileRouter))
    }
}
