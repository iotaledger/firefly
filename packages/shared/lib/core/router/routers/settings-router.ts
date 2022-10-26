import { get, writable } from 'svelte/store'

import { Router } from '../classes'
import { SettingsRoute } from '../enums'

export const settingsRouter = writable<SettingsRouter>(null)
export const settingsRoute = writable<SettingsRoute>(null)

const settingsChildRoute = writable<string>(null)

export class SettingsRouter extends Router<SettingsRoute> {
    constructor() {
        super(SettingsRoute.Init, settingsRoute)
    }

    goToChildRoute(route: SettingsRoute, childRoute: string): void {
        super.goTo(route)
        settingsChildRoute.set(childRoute)
    }

    reset(): void {
        super.reset()
        settingsChildRoute.set(null)
    }

    getChildRouteAndReset(): string {
        const childRoute = get(settingsChildRoute)
        settingsChildRoute.set(null)
        return childRoute
    }
}
