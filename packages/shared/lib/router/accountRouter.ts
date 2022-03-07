import { accountRoute } from 'shared/lib/router'
import { Router } from 'shared/lib/router/router'
import { AccountRoutes } from 'shared/lib/typings/routes'

export class AccountRouter extends Router<AccountRoutes> {
    constructor() {
        super(AccountRoutes.Init, accountRoute)
    }
}
