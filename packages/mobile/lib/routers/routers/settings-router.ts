import { get, writable, Writable } from 'svelte/store'
import { ISettingsRouterEvent } from '../interfaces'

import { Subrouter } from '@core/router'

import { profileRouter } from '.'
import { SettingsRoute } from '../enums'

export const settingsRoute = writable<SettingsRoute>(null)
export const settingsRouter = writable<SettingsRouter>(null)

const needsUnlockStore = writable<boolean>(false)

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
    previous(): void {
        if (get(needsUnlockStore)) {
            needsUnlockStore.set(false)
        } else {
            super.previous()
        }
    }
    getNeedsUnlockStore(): Writable<boolean> {
        return needsUnlockStore
    }
    setNeedsUnlock(value: boolean): void {
        needsUnlockStore.set(value)
    }
    reset(): void {
        super.reset()
        needsUnlockStore.set(false)
    }
}
