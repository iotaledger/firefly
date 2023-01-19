import { get, writable, Writable } from 'svelte/store'

import { Subrouter } from '@core/router'

import { ProfileRoute } from '../../enums'
import { IProfileRouterEvent } from '../../interfaces'
import { resetRouterWithDrawerDelay } from '../../utils'
import { dashboardRouter } from '../dashboard-router'

export const profileRoute = writable<ProfileRoute>(null)
export const profileRouter = writable<ProfileRouter>(null)

const needsUnlockStore = writable<boolean>(false)
const needsUnlockStoreCallbackStore = writable<(() => unknown) | undefined>(() => {})

export class ProfileRouter extends Subrouter<ProfileRoute> {
    constructor() {
        super(ProfileRoute.Actions, profileRoute, get(dashboardRouter))
    }
    public next(event: IProfileRouterEvent = {}): void {
        const { settings, networkStatus, backup } = event

        let nextRoute: ProfileRoute
        const currentRoute = get(this.routeStore)

        switch (currentRoute) {
            case ProfileRoute.Actions: {
                if (settings) {
                    nextRoute = ProfileRoute.Settings
                } else if (networkStatus) {
                    nextRoute = ProfileRoute.NetworkStatus
                } else if (backup) {
                    nextRoute = ProfileRoute.Backup
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
    previous(): void {
        if (get(needsUnlockStore)) {
            const callback = get(needsUnlockStoreCallbackStore)
            if (callback && typeof callback === 'function') {
                callback()
            }
            needsUnlockStore.set(false)
        } else {
            super.previous()
        }
    }
    getNeedsUnlockStore(): Writable<boolean> {
        return needsUnlockStore
    }
    getNeedsUnlockCallbackStore(): Writable<(() => unknown) | undefined> {
        return needsUnlockStoreCallbackStore
    }
    setNeedsUnlock(value: boolean, callback: (() => unknown) | undefined = undefined): void {
        needsUnlockStore.set(value)
        if (callback) {
            needsUnlockStoreCallbackStore.set(callback)
        }
    }
    reset(): void {
        super.reset()
        needsUnlockStore.set(false)
        needsUnlockStoreCallbackStore.set(undefined)
    }
}
