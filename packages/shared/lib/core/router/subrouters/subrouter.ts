import { Writable } from 'svelte/store'

import { Router } from '../router'
import { IRouter } from '../interfaces'

export abstract class Subrouter<R> extends Router<R> {
    protected parentRouter: IRouter

    constructor(protected initialRoute: R, storeRoute: Writable<R>, parentRouter: IRouter) {
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

    protected setNext(route: R): void {
        if (route) {
            super.setNext(route)
        }
    }
}
