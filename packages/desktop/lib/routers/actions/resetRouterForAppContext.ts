import { get } from 'svelte/store'
import { AppContext } from '@core/app/enums'
import { dashboardRouter } from '@core/router/routers'

export function resetRouterForAppContext(context: AppContext): void {
    get(dashboardRouter).reset()
    switch (context) {
        case AppContext.Dashboard:
            get(dashboardRouter).reset()
            break
        case AppContext.Login:
            get(dashboardRouter).reset()
            break
        default:
            break
    }
}
