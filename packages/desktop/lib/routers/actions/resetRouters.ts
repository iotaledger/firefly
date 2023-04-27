import {
    appRouter,
    collectiblesRouter,
    dashboardRouter,
    governanceRouter,
    loginRouter,
    settingsRouter,
    updateStrongholdRouter,
} from '@core/router'
import { onboardingRouter, restoreFromMnemonicRouter, restoreFromStrongholdRouter } from '@views/onboarding'
import { get } from 'svelte/store'

export function resetRouters(): void {
    resetSubrouters()
    resetBaseRouters()
}

function resetSubrouters(): void {
    get(loginRouter).reset()
    get(restoreFromMnemonicRouter).reset()
    get(restoreFromStrongholdRouter).reset()
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
