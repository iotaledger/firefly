import { writable } from 'svelte/store'
import { Router } from '../classes'
import { ImplicitAccountCreationRoute } from '../enums'

export const implicitAccountCreationRouter = writable<ImplicitAccountCreationRouter>(null)
export const implicitAccountCreationRoute = writable<ImplicitAccountCreationRoute>(null)

export class ImplicitAccountCreationRouter extends Router<ImplicitAccountCreationRoute> {
    constructor() {
        super(ImplicitAccountCreationRoute.Activate, implicitAccountCreationRoute)
    }
}
