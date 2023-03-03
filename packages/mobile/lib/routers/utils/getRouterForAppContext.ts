import { get } from 'svelte/store'

import { AppContext } from '@core/app/enums'
import { IRouter } from '@core/router/interfaces'

import { loginRouter, onboardingRouter } from '../routers'

export function getRouterForAppContext(context: AppContext): IRouter {
    switch (context) {
        case AppContext.Dashboard:
            return undefined
        case AppContext.Login:
            return get(loginRouter)
        case AppContext.Onboarding:
            return get(onboardingRouter)
        default:
            return undefined
    }
}
