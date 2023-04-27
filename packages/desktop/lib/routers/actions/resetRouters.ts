import {
    appRouter,
    collectiblesRouter,
    dashboardRouter,
    governanceRouter,
    loginRouter,
    settingsRouter,
    updateStrongholdRouter,
} from '@core/router'
import {
    completeOnboardingRouter,
    createFromLedgerRouter,
    createFromMnemonicRouter,
    createProfileRouter,
    networkSetupRouter,
    onboardingRouter,
} from '@views/onboarding'
import { get } from 'svelte/store'
import { restoreFromMnemonicRouter } from '../../../views/onboarding/views/restore-from-mnemonic/restore-from-mnemonic-router'
import { restoreFromStrongholdRouter } from '../../../views/onboarding/views/restore-from-stronghold/restore-from-stronghold-router'
import { restoreProfileRouter } from '../../../views/onboarding/views/restore-profile/restore-profile-router'

export function resetRouters(): void {
    resetSubrouters()
    resetBaseRouters()
}

function resetSubrouters(): void {
    get(loginRouter).reset()
    get(networkSetupRouter).reset()
    get(createProfileRouter).reset()
    get(createFromMnemonicRouter).reset()
    get(createFromLedgerRouter).reset()
    get(restoreProfileRouter).reset()
    get(restoreFromMnemonicRouter).reset()
    get(restoreFromStrongholdRouter).reset()
    get(completeOnboardingRouter).reset()
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
