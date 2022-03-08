import { Router } from 'shared/lib/core/router/router'
import { WalletRoutes } from 'shared/lib/typings/routes'
import { writable } from 'svelte/store'

export const walletRoute = writable<WalletRoutes>(null)
export const walletRouter = writable<WalletRouter>(null)

export class WalletRouter extends Router<WalletRoutes> {
    constructor() {
        super(WalletRoutes.Init, walletRoute)
    }
}
