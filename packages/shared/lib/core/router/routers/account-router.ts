import { writable } from 'svelte/store'
import { Router } from '../classes'
import { AccountRoute } from '../enums'

export const accountRouter = writable<AccountRouter>(null)
export const accountRoute = writable<AccountRoute>(null)

export class AccountRouter extends Router<AccountRoute> {
    constructor() {
        super(AccountRoute.Activate, accountRoute)
    }
}
