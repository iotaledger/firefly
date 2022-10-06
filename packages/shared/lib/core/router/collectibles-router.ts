import { writable } from 'svelte/store'

import { CollectiblesRoute } from './enums'
import { Router } from './router'

export const collectiblesRouter = writable<CollectiblesRouter>(null)
export const collectiblesRoute = writable<CollectiblesRoute>(null)

export class CollectiblesRouter extends Router<CollectiblesRoute> {
    constructor() {
        super(CollectiblesRoute.Gallery, collectiblesRoute)
    }
}
