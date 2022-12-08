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

import { selectedAsset, TokenAction } from '../../../lib/contexts/dashboard'
import { dashboardRouter, DashboardRoute } from '../'
import { TokenRoute } from '../enums'
import { ITokenRouterEvent } from '../interfaces'
import { resetRouterWithDrawerDelay } from '../utils'

export const tokenRoute = writable<TokenRoute>(null)
export const tokenRouter = writable<TokenRouter>(null)

export class TokenRouter extends Subrouter<TokenRoute> {
    constructor() {
        super(TokenRoute.Info, tokenRoute, get(dashboardRouter))
    }
    public next(event: ITokenRouterEvent = {}): void {
        const { asset, action } = event

        if (asset && get(tokenRoute) === TokenRoute.Info) {
            selectedAsset.set(asset)
            return
        }

        if (!get(selectedAsset)) {
            return
        }

        const { id } = get(selectedAsset)

        if (action) {
            switch (action) {
                case TokenAction.Skip:
                    unverifyAsset(id, NotVerifiedStatus.Skipped)
                    selectedAsset.set(getPersistedAsset(id))
                    return
                case TokenAction.Verify:
                    verifyAsset(id, VerifiedStatus.SelfVerified)
                    selectedAsset.set(getPersistedAsset(id))
                    return
                default:
                    return
            }
        }

        updateNewTransactionDetails({ type: NewTransactionType.TokenTransfer, assetId: id })
        get(dashboardRouter).previous()
        get(dashboardRouter).goTo(DashboardRoute.Send)
    }

    closeDrawer(): void {
        selectedAsset.set(null)
        get(dashboardRouter).previous()
        resetRouterWithDrawerDelay(get(tokenRouter))
    }
}
