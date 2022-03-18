import { writable } from 'svelte/store'
import { WalletRoutes } from '@core/router'
import { Router } from './router'

export const walletRoute = writable<WalletRoutes>(null)
export const walletRouter = writable<WalletRouter>(null)

export class WalletRouter extends Router<WalletRoutes> {
    constructor() {
        super(WalletRoutes.Init, walletRoute)
    }
}
