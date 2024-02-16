import {
    appRouter,
    collectiblesRouter,
    dashboardRouter,
    governanceRouter,
    loginRouter,
    settingsRouter,
    implicitAccountCreationRouter,
    onboardingRouter,
} from '@core/router'
import { get } from 'svelte/store'

export function resetRouters(): void {
    resetSubrouters()
    resetBaseRouters()
}

function resetSubrouters(): void {
    get(loginRouter).reset()
}

function resetBaseRouters(): void {
    get(appRouter).reset()
    get(dashboardRouter).reset()
    get(onboardingRouter).reset()
    get(settingsRouter).reset()
    get(collectiblesRouter).reset()
    get(governanceRouter).reset()
    get(implicitAccountCreationRouter).reset()
}
