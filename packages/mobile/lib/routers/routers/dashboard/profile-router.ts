import { get, writable, Writable } from 'svelte/store'

import { showAppNotification } from '@auxiliary/notification'
import { localize } from '@core/i18n'
import { Subrouter } from '@core/router'

import { ProfileRoute } from '../../enums'
import { IProfileRouterEvent } from '../../interfaces'
import { resetRouterWithDrawerDelay } from '../../utils'
import { dashboardRouter } from '../dashboard-router'

export const profileRoute = writable<ProfileRoute>(null)
export const profileRouter = writable<ProfileRouter>(null)

const needsUnlockStore = writable<boolean>(false)
const needsUnlockStoreCallbackStore = writable<((password?: string) => unknown) | undefined>(() => {})
const returnPasswordUnlockCallbackStore = writable<boolean>(false)

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
        needsUnlockStore.set(false)
        needsUnlockStoreCallbackStore.set(undefined)
        returnPasswordUnlockCallbackStore.set(false)
    }
    handleExportResult(cancelled: boolean, error: boolean): void {
        if (!cancelled) {
            if (error) {
                showAppNotification({
                    type: 'error',
                    message: localize('general.exportingStrongholdFailed'),
                })
            } else {
                showAppNotification({
                    type: 'info',
                    message: localize('general.exportingStrongholdSuccess'),
                })
                this.previous()
            }
        }
    }
}
