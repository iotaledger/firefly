import { Writable } from 'svelte/store'

import { IRouter } from '../interfaces'

import { Router } from './router.class'

export abstract class Subrouter<R> extends Router<R> {
    protected parentRouter: IRouter

    constructor(protected initialRoute: R, storeRoute: Writable<R>, parentRouter: IRouter) {
        super(initialRoute, storeRoute)
        this.parentRouter = parentRouter
    }

    previous(): void {
        if (this.history.length > 0) {
            super.previous()
        } else {
            this.parentRouter.previous()
        }
    }

    protected setNext(route: R): void {
        if (route) {
            super.setNext(route)
        }
    }
}
