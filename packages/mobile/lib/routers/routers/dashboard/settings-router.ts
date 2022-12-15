import { get, writable } from 'svelte/store'

import { Subrouter } from '@core/router'

import { profileRouter } from '../'
import { SettingsRoute } from '../../enums'

export const settingsRoute = writable<SettingsRoute>(null)
export const settingsRouter = writable<SettingsRouter>(null)

export class SettingsRouter extends Subrouter<SettingsRoute> {
    constructor() {
        super(SettingsRoute.Init, settingsRoute, get(profileRouter))
    }
    next(): void {
        this.setNext(SettingsRoute.ChangePassword)
    }
}
