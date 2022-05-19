import { writable } from 'svelte/store'

import { AccountRoute } from './enums'
import { Router } from './router'

export const accountRoute = writable<AccountRoute>(null)
export const accountRouter = writable<AccountRouter>(null)

export class AccountRouter extends Router<AccountRoute> {
    constructor() {
        super(AccountRoute.Init, accountRoute)
    }
}
