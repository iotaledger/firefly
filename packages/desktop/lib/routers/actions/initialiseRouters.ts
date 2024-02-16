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
import {
    implicitAccountCreationRouter,
    ImplicitAccountCreationRouter,
    OnboardingRouter,
    onboardingRouter,
    loginRouter,
    LoginRouter,
} from '@core/router/subrouters'

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
    implicitAccountCreationRouter.set(new ImplicitAccountCreationRouter())
    initialiseBaseOnboardingRouters()
}

function initialiseBaseOnboardingRouters(): void {
    onboardingRouter.set(new OnboardingRouter())
}

function initialiseSubrouters(): void {
    loginRouter.set(new LoginRouter())
}
