import { writable } from 'svelte/store'

import { Router } from '../classes'
import { CollectiblesRoute } from '../enums'

export const collectiblesRouter = writable<CollectiblesRouter>(null)
export const collectiblesRoute = writable<CollectiblesRoute>(null)

export class CollectiblesRouter extends Router<CollectiblesRoute> {
    constructor() {
        super(CollectiblesRoute.Gallery, collectiblesRoute)
    }
}
