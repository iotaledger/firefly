import { writable } from 'svelte/store'

import { Router } from '../classes'
import { GovernanceRoute } from '../enums'

export const governanceRouter = writable<GovernanceRouter>(null)
export const governanceRoute = writable<GovernanceRoute>(null)

export class GovernanceRouter extends Router<GovernanceRoute> {
    constructor() {
        super(GovernanceRoute.Proposals, governanceRoute)
    }
}
