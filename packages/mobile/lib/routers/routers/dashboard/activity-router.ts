import { get, writable } from 'svelte/store'

import { Subrouter } from '@core/router'
import { ActivityType, claimActivity, getAssetById, NotVerifiedStatus, rejectActivity } from '@core/wallet'

import { ActivityAction, selectedActivity } from '../../../../lib/contexts/dashboard'
import { ActivityRoute } from '../../enums'
import { IActivityRouterEvent } from '../../interfaces'
import { dashboardRouter, tokenRouter } from '../../routers'
import { resetRouterWithDrawerDelay } from '../../utils'

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
            if (activity.type === ActivityType.Basic) {
                const asset = getAssetById(activity.assetId)
                if (asset?.verification?.status === NotVerifiedStatus.New) {
                    get(tokenRouter)?.next({ asset })
                    return
                }
            }
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
    public closeDrawer(): void {
        selectedActivity.set(null)
        get(dashboardRouter).previous()
        resetRouterWithDrawerDelay(get(activityRouter))
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
