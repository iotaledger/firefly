import { get, writable } from 'svelte/store'

import { Subrouter } from '@core/router'

import { selectedAsset } from '../../../lib/contexts/dashboard'
import { dashboardRouter } from '../dashboard-router'
import { TokenRoute } from '../enums'
import { ITokenRouterEvent } from '../interfaces'

export const tokenRoute = writable<TokenRoute>(null)
export const tokenRouter = writable<TokenRouter>(null)

export class TokenRouter extends Subrouter<TokenRoute> {
    constructor() {
        super(TokenRoute.Info, tokenRoute, get(dashboardRouter))
    }
    public next(event: ITokenRouterEvent = {}): void {
        const { asset } = event
        if (asset) {
            selectedAsset.set(asset)
        }
    }
}
