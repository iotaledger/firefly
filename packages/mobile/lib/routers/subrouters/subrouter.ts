import { Writable } from 'svelte/store'

import { Router } from '@core/router/router'
import { ParentRouter } from '../types/parent-routers.type'

export abstract class Subrouter<Route> extends Router<Route> {
    protected parentRouter: ParentRouter

    constructor(protected initialRoute: Route, storeRoute: Writable<Route>, parentRouter: ParentRouter) {
        super(initialRoute, storeRoute)
        this.parentRouter = parentRouter
    }

    previous(): void {
        if (this.history.length === 0) {
            this.parentRouter.previous()
        } else {
            super.previous()
        }
    }

    protected setNext(route: Route): void {
        if (route) {
            super.setNext(route)
        }
    }
}
