import { get, writable } from 'svelte/store'

import { Subrouter } from '@core/router'

import { ActivityRoute } from '../enums'
import { dashboardRouter } from '../dashboard-router'

export const activityRoute = writable<ActivityRoute>(null)
export const activityRouter = writable<ActivityRouter>(null)

export class ActivityRouter extends Subrouter<ActivityRoute> {
    constructor() {
        super(ActivityRoute.Details, activityRoute, get(dashboardRouter))
    }
}
