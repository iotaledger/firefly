import { writable } from 'svelte/store'

import { WalletRoute } from './enums'
import { Router } from './router'

export const walletRouter = writable<WalletRouter>(null)
export const walletRoute = writable<WalletRoute>(null)

export class WalletRouter extends Router<WalletRoute> {
    constructor() {
        super(WalletRoute.Assets, walletRoute)
    }
}
