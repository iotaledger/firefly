import { get, writable, Writable } from 'svelte/store'

import { Subrouter } from '@core/router'

import { AccountAction } from '@/contexts/dashboard'
import { AccountActionsRoute } from '../../enums'
import { IAccountActionsRouterEvent } from '../../interfaces'
import { dashboardRouter } from '../dashboard-router'

export const accountActionsRoute = writable<AccountActionsRoute>(null)
export const accountActionsRouter = writable<AccountActionsRouter>(null)

const needsUnlockStore = writable<boolean>(false)
const needsUnlockStoreCallbackStore = writable<(() => unknown) | undefined>(() => {})

export class AccountActionsRouter extends Subrouter<AccountActionsRoute> {
    constructor() {
        super(AccountActionsRoute.Actions, accountActionsRoute, get(dashboardRouter))
    }

    next(event: IAccountActionsRouterEvent = {}): void {
        const { action } = event
        let nextRoute: AccountActionsRoute
        const currentRoute = get(this.routeStore)

        switch (currentRoute) {
            case AccountActionsRoute.Actions: {
                switch (action) {
                    case AccountAction.Customize: {
                        nextRoute = AccountActionsRoute.Customize
                        break
                    }
                    case AccountAction.Delete: {
                        nextRoute = AccountActionsRoute.DeleteConfirmation
                        break
                    }
                    case AccountAction.BalanceBreakdown: {
                        nextRoute = AccountActionsRoute.BalanceBreakdown
                        break
                    }
                }
                break
            }
            case AccountActionsRoute.BalanceBreakdown: {
                switch (action) {
                    case AccountAction.Consolidate: {
                        nextRoute = AccountActionsRoute.ConsolidateConfirmation
                        break
                    }
                }
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
    setNeedsUnlock(value: boolean, callback: ((password?: string) => unknown) | undefined = undefined): void {
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
