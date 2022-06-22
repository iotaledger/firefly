import { writable } from 'svelte/store'

import { ProfileRoute } from './enums'
import { Router } from './router'

export const profileRoute = writable<ProfileRoute>(null)
export const profileRouter = writable<ProfileRouter>(null)

export class ProfileRouter extends Router<ProfileRoute> {
    constructor() {
        super(ProfileRoute.ProfileActions, profileRoute)
    }
}
