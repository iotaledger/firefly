import { writable } from 'svelte/store'

import { AccountRoutes } from './enums'
import { Router } from './router'

export const accountRoute = writable<AccountRoutes>(null)
export const accountRouter = writable<AccountRouter>(null)

export class AccountRouter extends Router<AccountRoutes> {
    constructor() {
        super(AccountRoutes.Init, accountRoute)
    }
}
