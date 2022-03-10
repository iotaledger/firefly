import { appRouter } from '@core/router'
import { Router } from '@core/router/router'
import { get } from 'svelte/store'

export class Subrouter<Route> extends Router<Route> {
    previous(): void {
        if (this.history.length === 0) {
            get(appRouter).previous()
        } else {
            super.previous()
        }
    }
}
