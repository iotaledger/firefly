import { get } from 'svelte/store'

import { AppContext } from '@core/app/enums'
import { IRouter } from '@core/router/interfaces'
import { dashboardRouter, settingsRouter } from '@core/router/routers'
import { loginRouter } from '@core/router/subrouters'
import { onboardingRouter } from '@views/onboarding'

export function getRouterForAppContext(context: AppContext): IRouter {
    switch (context) {
        case AppContext.Dashboard:
            return get(dashboardRouter)
        case AppContext.Login:
            return get(loginRouter)
        case AppContext.Onboarding:
            return get(onboardingRouter)
        case AppContext.Settings:
            return get(settingsRouter)
        default:
            return undefined
    }
}
