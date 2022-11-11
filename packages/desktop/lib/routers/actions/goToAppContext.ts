import { get } from 'svelte/store'

import { AppContext } from '@core/app/enums'
import { AppRoute, appRouter } from '@core/router'
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

// TODO: Put this in helpers
function getAppRouteForContext(context: AppContext): AppRoute {
    switch (context) {
        case AppContext.Dashboard:
            return AppRoute.Dashboard
        case AppContext.Login:
            return AppRoute.Login
        case AppContext.Onboarding:
            return AppRoute.Onboarding
        default:
            return undefined
    }
}
