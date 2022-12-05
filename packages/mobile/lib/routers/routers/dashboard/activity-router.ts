import { get, writable } from 'svelte/store'

import { Subrouter } from '@core/router'
import { claimActivity, rejectActivity } from '@core/wallet'

import { ActivityAction } from '../../../lib/contexts/dashboard'
import { selectedActivity } from '../../../lib/contexts/dashboard'
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
    public next(event: IActivityRouterEvent = {}): void {
        const { action, activity, isUnlocked } = event

        if (activity) {
            selectedActivity.set(activity)
        }

        switch (action) {
            case ActivityAction.FastClaim:
                this.backToDashboard = true
                this.claim(isUnlocked)
                return
            case ActivityAction.FastReject:
                this.backToDashboard = true
                this.reject()
                return
            case ActivityAction.Claim:
                this.claim(isUnlocked)
                return
            case ActivityAction.Reject:
                this.reject()
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
    private claim(isUnlocked: boolean | undefined): void {
        if (!isUnlocked) {
            this.setNext(ActivityRoute.Password)
        } else {
            claimActivity(get(selectedActivity))
            selectedActivity.set(null)
            get(dashboardRouter).previous()
        }
    }
    private reject(): void {
        if (get(activityRoute) === ActivityRoute.Reject) {
            rejectActivity(get(selectedActivity).id)
            get(dashboardRouter).previous()
        } else {
            this.setNext(ActivityRoute.Reject)
        }
    }
}
