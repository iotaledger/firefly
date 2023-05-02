import {
    appRouter,
    collectiblesRouter,
    dashboardRouter,
    governanceRouter,
    loginRouter,
    settingsRouter,
    updateStrongholdRouter,
} from '@core/router'
import { onboardingRouter } from '@views/onboarding'
import { get } from 'svelte/store'
import { sendRouter } from '@desktop/routers'

export function resetRouters(): void {
    resetPopupRouters()
    resetSubrouters()
    resetBaseRouters()
}

export function resetPopupRouters(): void {
    get(sendRouter).reset()
}

function resetSubrouters(): void {
    get(loginRouter).reset()
    get(updateStrongholdRouter)?.reset() // Is potentially null because we only initialize it in the respective parent router (login/recovery)
}

function resetBaseRouters(): void {
    get(appRouter).reset()
    get(dashboardRouter).reset()
    get(onboardingRouter).reset()
    get(settingsRouter).reset()
    get(collectiblesRouter).reset()
    get(governanceRouter).reset()
}
