import {
    appRouter,
    AppRouter,
    collectiblesRouter,
    CollectiblesRouter,
    DashboardRouter,
    dashboardRouter,
    GovernanceRouter,
    governanceRouter,
    SettingsRouter,
    settingsRouter,
} from '@core/router/routers'
import { loginRouter, LoginRouter } from '@core/router/subrouters'
import { OnboardingRouter, onboardingRouter } from '@views/onboarding'
import { implicitAccountCreationRouter, ImplicitAccountCreationRouter } from '@views/dashboard/wallet'

export function initialiseRouters(): void {
    /**
     * CAUTION: It is important that subrouters are initialized
     * AFTER the base routers, since each subrouter relies on the
     * its parent router's store during construction.
     */
    initialiseBaseRouters()
    initialiseSubrouters()
}

export function initialiseOnboardingRouters(): void {
    initialiseBaseOnboardingRouters()
}

function initialiseBaseRouters(): void {
    appRouter.set(new AppRouter())
    dashboardRouter.set(new DashboardRouter())
    settingsRouter.set(new SettingsRouter())
    collectiblesRouter.set(new CollectiblesRouter())
    governanceRouter.set(new GovernanceRouter())
    initialiseBaseOnboardingRouters()
    initialiseBaseImplicitAccountCreationRouters()
}

function initialiseBaseOnboardingRouters(): void {
    onboardingRouter.set(new OnboardingRouter())
}

function initialiseBaseImplicitAccountCreationRouters(): void {
    implicitAccountCreationRouter.set(new ImplicitAccountCreationRouter())
}

function initialiseSubrouters(): void {
    loginRouter.set(new LoginRouter())
}
