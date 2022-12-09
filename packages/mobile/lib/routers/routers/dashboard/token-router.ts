import { get, writable } from 'svelte/store'

import { Subrouter } from '@core/router'
import {
    NewTransactionType,
    updateNewTransactionDetails,
    NotVerifiedStatus,
    unverifyAsset,
    VerifiedStatus,
    verifyAsset,
    getPersistedAsset,
} from '@core/wallet'

import { selectedAsset, TokenAction } from '../../../contexts/dashboard'
import { dashboardRouter } from '../dashboard-router'

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
        get(dashboardRouter).previous()
        resetRouterWithDrawerDelay(get(tokenRouter))
    }

    private handleTokenAction(action) {
        if (!get(selectedAsset)) {
            return
        }

        const { id } = get(selectedAsset)

        switch (action) {
            case TokenAction.Skip:
                unverifyAsset(id, NotVerifiedStatus.Skipped)
                selectedAsset.set(getPersistedAsset(id))
                return
            case TokenAction.Verify:
                verifyAsset(id, VerifiedStatus.SelfVerified)
                selectedAsset.set(getPersistedAsset(id))
                return
            case TokenAction.Send:
                updateNewTransactionDetails({ type: NewTransactionType.TokenTransfer, assetId: id })
                get(dashboardRouter).previous()
                get(dashboardRouter).goTo(DashboardRoute.Send)
        }
    }
}
