import { get, writable } from 'svelte/store'

import { Router } from '@core/router'

import { closeDrawer, DrawerId } from '@/auxiliary/drawer'
import { networkConfigurationSettingsRouter, settingsRouter } from '../'
import { ProfileRoute } from '../../enums'
import { resetRouterWithDrawerDelay } from '../../utils'

export const profileRoute = writable<ProfileRoute>(null)
export const profileRouter = writable<ProfileRouter>(null)

export class ProfileRouter extends Router<ProfileRoute> {
    constructor() {
        super(ProfileRoute.Actions, profileRoute)
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
        closeDrawer(DrawerId.Profile)
        resetRouterWithDrawerDelay(get(settingsRouter))
        resetRouterWithDrawerDelay(get(networkConfigurationSettingsRouter))
        resetRouterWithDrawerDelay(get(profileRouter))
    }
}
