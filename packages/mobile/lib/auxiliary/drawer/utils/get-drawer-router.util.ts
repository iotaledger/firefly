import { get, Writable } from 'svelte/store'

import { IRouter } from '@core/router/interfaces'

import {
    networkInformationSettingsRouter,
    ProfileRoute,
    profileRoute,
    profileRouter,
    sendRouter,
    SettingsRoute,
    settingsRoute,
    settingsRouter,
} from '@/routers'
import { DrawerId } from '../enums'

export function getDrawerRouter(drawerId: DrawerId): Writable<IRouter> | undefined {
    switch (drawerId) {
        case DrawerId.Profile: {
            const $profileRoute = get(profileRoute)
            const $settingsRoute = get(settingsRoute)
            if ($profileRoute === ProfileRoute.Settings) {
                if ($settingsRoute === SettingsRoute.NetworkInformation) {
                    return networkInformationSettingsRouter
                } else {
                    return settingsRouter
                }
            } else {
                return profileRouter
            }
        }
        case DrawerId.Send:
            return sendRouter
        default:
            return undefined
    }
}
