import { get, Writable } from 'svelte/store'

import { Router } from '../router'
import { ParentRouter } from '@core/router/types/parent-routers.type'

export abstract class Subrouter<Route> extends Router<Route> {
    private parentRouter: Writable<ParentRouter>

    constructor(protected initialRoute: Route, storeRoute: Writable<Route>, parentRouter: Writable<ParentRouter>) {
        super(initialRoute, storeRoute)
        this.parentRouter = parentRouter
    }

    previous(): void {
        if (this.history.length === 0) {
            get(this.parentRouter).previous()
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
