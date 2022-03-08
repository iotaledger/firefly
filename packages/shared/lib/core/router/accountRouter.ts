import { Router } from 'shared/lib/core/router/router'
import { AccountRoutes } from 'shared/lib/typings/routes'
import { writable } from 'svelte/store'

export const accountRoute = writable<AccountRoutes>(null)
export const accountRouter = writable<AccountRouter>(null)

export class AccountRouter extends Router<AccountRoutes> {
    constructor() {
        super(AccountRoutes.Init, accountRoute)
    }
}
