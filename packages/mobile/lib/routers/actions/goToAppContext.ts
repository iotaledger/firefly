import { get } from 'svelte/store'

import { AppContext } from '@core/app/enums'
import { appRouter } from '../routers'

import { getAppRouteForContext } from '../helpers'
import { resetRouters } from './resetRouters'

export function goToAppContext(context: AppContext): void {
    resetRouters()

    const appRoute = getAppRouteForContext(context)
    if (appRoute) {
        get(appRouter).goTo(appRoute)
    } else {
        throw new Error(`No app-level route defined for the "${context}" context.`)
    }
}
