import { get, writable } from 'svelte/store'

import { Subrouter } from '@core/router'

import { dashboardRouter } from '../dashboard-router'
import { ActivityRoute } from '../enums'
import { IActivityRouterEvent } from '../interfaces'

export const activityRoute = writable<ActivityRoute>(null)
export const activityRouter = writable<ActivityRouter>(null)

export class ActivityRouter extends Subrouter<ActivityRoute> {
    private backToDashboard = false

    constructor() {
        super(ActivityRoute.Details, activityRoute, get(dashboardRouter))
    }
    public next(event: IActivityRouterEvent): void {
        this.backToDashboard = event.backToDashboard ? true : false

        if (event.route) {
            this.setNext(event.route)
        } else {
            this.setNext(ActivityRoute.Details)
        }
    }
    public previous(): void {
        if (this.backToDashboard) {
            get(dashboardRouter).previous()
            this.backToDashboard = false
        } else {
            super.previous()
        }
    }
}
