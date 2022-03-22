import { get } from 'svelte/store'

import { appRouter } from '../app-router'
import { Router } from '../router'

export abstract class Subrouter<Route> extends Router<Route> {
    previous(): void {
        if (this.history.length === 0) {
            get(appRouter).previous()
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
