import { writable } from 'svelte/store'

import { GovernanceRoute } from './enums'
import { Router } from './router'

export const governanceRouter = writable<GovernanceRouter>(null)
export const governanceRoute = writable<GovernanceRoute>(null)

export class GovernanceRouter extends Router<GovernanceRoute> {
    constructor() {
        super(GovernanceRoute.Init, governanceRoute)
    }
}
