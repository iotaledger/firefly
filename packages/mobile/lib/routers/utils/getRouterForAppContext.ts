import { get } from 'svelte/store'

import { AppContext } from '@core/app/enums'
import { IRouter } from '@core/router/interfaces'

import { dashboardRouter, loginRouter, onboardingRouter } from '../routers'

export function getRouterForAppContext(context: AppContext): IRouter {
    switch (context) {
        case AppContext.Dashboard:
            return get(dashboardRouter)
        case AppContext.Login:
            return get(loginRouter)
        case AppContext.Onboarding:
            return get(onboardingRouter)
        default:
            return undefined
    }
}
