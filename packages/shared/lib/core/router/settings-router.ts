import { get, writable } from 'svelte/store'

import { SettingsRoutes } from './enums'
import { Router } from './router'

export const settingsRouter = writable<SettingsRouter>(null)
export const settingsRoute = writable<SettingsRoutes>(null)

const settingsChildRoute = writable<string>(null)

export class SettingsRouter extends Router<SettingsRoutes> {
    constructor() {
        super(SettingsRoutes.Init, settingsRoute)
    }

    goToChildRoute(route: SettingsRoutes, childRoute: string): void {
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
