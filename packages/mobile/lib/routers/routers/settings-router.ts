import { get, writable, Writable } from 'svelte/store'
import { ISettingsRouterEvent } from '../interfaces'

import { Subrouter } from '@core/router'

import { profileRouter, networkConfigurationSettingsRouter } from '.'
import { SettingsRoute } from '../enums'

export const settingsRoute = writable<SettingsRoute>(null)
export const settingsRouter = writable<SettingsRouter>(null)

const needsUnlockStore = writable<boolean>(false)
const needsUnlockStoreCallbackStore = writable<((password?: string) => unknown) | undefined>(() => {})
const returnPasswordUnlockCallbackStore = writable<boolean>(false)

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
            const callback = get(needsUnlockStoreCallbackStore)
            if (callback && typeof callback === 'function') {
                callback()
            }
            needsUnlockStore.set(false)
            returnPasswordUnlockCallbackStore.set(false)
        } else {
            super.previous()
        }
    }
    getNeedsUnlockStore(): Writable<boolean> {
        return needsUnlockStore
    }
    getNeedsUnlockCallbackStore(): Writable<((password?: string) => unknown) | undefined> {
        return needsUnlockStoreCallbackStore
    }
    getReturnPasswordUnlockCallbackStore(): Writable<boolean> {
        return returnPasswordUnlockCallbackStore
    }
    setNeedsUnlock(
        value: boolean,
        callback: ((password?: string) => unknown) | undefined = undefined,
        returnPassword: boolean = false
    ): void {
        needsUnlockStore.set(value)
        returnPasswordUnlockCallbackStore.set(returnPassword)
        if (callback) {
            needsUnlockStoreCallbackStore.set(callback)
        }
    }
    reset(): void {
        super.reset()
        get(networkConfigurationSettingsRouter)?.reset()
        needsUnlockStore.set(false)
        needsUnlockStoreCallbackStore.set(undefined)
        returnPasswordUnlockCallbackStore.set(false)
    }
}
