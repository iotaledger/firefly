import { walletRoute } from 'shared/lib/router'
import { Router } from 'shared/lib/core/router/router'
import { WalletRoutes } from 'shared/lib/typings/routes'

export class WalletRouter extends Router<WalletRoutes> {
    constructor() {
        super(WalletRoutes.Init, walletRoute)
    }
}
