import { get, writable } from 'svelte/store'

import { Subrouter } from '@core/router'
import {
    NewTransactionType,
    updateNewTransactionDetails,
    NotVerifiedStatus,
    unverifyAsset,
    VerifiedStatus,
    verifyAsset,
    getAssetById,
} from '@core/wallet'

import { selectedActivity, selectedAsset, TokenAction } from '../../../contexts/dashboard'
import { activityRouter, dashboardRouter, sendRouter } from '../'

import { TokenRoute, DashboardRoute } from '../../enums'
import { ITokenRouterEvent } from '../../interfaces'
import { resetRouterWithDrawerDelay } from '../../utils'

export const tokenRoute = writable<TokenRoute>(null)
export const tokenRouter = writable<TokenRouter>(null)

export class TokenRouter extends Subrouter<TokenRoute> {
    constructor() {
        super(TokenRoute.Info, tokenRoute, get(dashboardRouter))
    }
    public next(event: ITokenRouterEvent = {}): void {
        const { asset, action } = event

        if (get(tokenRoute) === TokenRoute.Info) {
            if (asset) {
                selectedAsset.set(asset)
            }

            if (action) {
                this.handleTokenAction(action)
            }
        }
    }

    public closeDrawer(): void {
        selectedAsset.set(null)
        // previous() opens the activity information instead of closing the drawer
        // when the token information are displayed because an activity was clicked.
        if (!get(selectedActivity)) {
            get(dashboardRouter).previous()
        }
        resetRouterWithDrawerDelay(get(tokenRouter))
    }

    private activitySelected(): boolean {
        const activity = get(selectedActivity)
        if (activity) {
            selectedAsset.set(null)
            get(dashboardRouter).reset()
            get(tokenRouter).reset()
            get(activityRouter)?.next({ activity })
            return true
        }
        return false
    }

    private handleTokenAction(action): void {
        if (!get(selectedAsset)) {
            return
        }

        const { id } = get(selectedAsset)

        switch (action) {
            case TokenAction.Skip:
                unverifyAsset(id, NotVerifiedStatus.Skipped)
                if (!this.activitySelected()) {
                    selectedAsset.set(getAssetById(id))
                }
                return
            case TokenAction.Verify: {
                verifyAsset(id, VerifiedStatus.SelfVerified)
                if (!this.activitySelected()) {
                    selectedAsset.set(getAssetById(id))
                }
                return
            }
            case TokenAction.Send:
                updateNewTransactionDetails({ type: NewTransactionType.TokenTransfer, assetId: id })
                get(sendRouter).next()
                this.closeDrawer()
                get(dashboardRouter).goTo(DashboardRoute.Send)
        }
    }
}
