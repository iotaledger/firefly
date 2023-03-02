import { get, writable } from 'svelte/store'
import { ISettingsRouterEvent } from '../interfaces'

import { Subrouter } from '@core/router'

import { profileRouter } from '.'
import { SettingsRoute } from '../enums'

export const settingsRoute = writable<SettingsRoute>(null)
export const settingsRouter = writable<SettingsRouter>(null)

export class SettingsRouter extends Subrouter<SettingsRoute> {
    constructor() {
        super(SettingsRoute.Init, settingsRoute, get(profileRouter))
    }
    next(event: ISettingsRouterEvent = {}): void {
        const { goTo } = event

        let nextRoute: SettingsRoute
        const currentRoute = get(this.routeStore)

        switch (currentRoute) {
            case SettingsRoute.Init: {
                if (goTo) {
                    super.goTo(goTo)
                }
                break
            }
            default: {
                this.previous()
                break
            }
        }

        this.setNext(nextRoute)
    }
}
