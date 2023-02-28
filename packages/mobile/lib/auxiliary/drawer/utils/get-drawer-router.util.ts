import { Writable } from 'svelte/store'

import { IRouter } from '@core/router/interfaces'

import { accountActionsRouter, profileRouter, sendRouter } from '@/routers'
import { DrawerId } from '../enums'

export function getDrawerRouter(drawerId: DrawerId): Writable<IRouter> | undefined {
    switch (drawerId) {
        case DrawerId.AccountActions:
            return accountActionsRouter
        case DrawerId.Profile:
            return profileRouter
        case DrawerId.Send:
            return sendRouter
        default:
            return undefined
    }
}
