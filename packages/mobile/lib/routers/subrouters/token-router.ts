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

export const tokenRoute = writable<TokenRoute>(null)
export const tokenRouter = writable<TokenRouter>(null)

export class TokenRouter extends Subrouter<TokenRoute> {
    constructor() {
        super(TokenRoute.Info, tokenRoute, get(dashboardRouter))
    }
    public next(event: ITokenRouterEvent = {}): void {
        const { action, asset } = event

        if (asset) {
            selectedAsset.set(asset)
        }

        if (!get(selectedAsset)) {
            return
        }

        const { id } = get(selectedAsset)
        switch (action) {
            case TokenAction.Send:
                updateNewTransactionDetails({ type: NewTransactionType.TokenTransfer, assetId: id })
                get(dashboardRouter).previous()
                get(dashboardRouter).goTo(DashboardRoute.Send)
                return
            case TokenAction.Skip:
                unverifyAsset(id, NotVerifiedStatus.Skipped)
                selectedAsset.set(getPersistedAsset(id))
                return
            case TokenAction.Verify:
                verifyAsset(id, VerifiedStatus.SelfVerified)
                selectedAsset.set(getPersistedAsset(id))
                return
        }
    }
}
