import { IAnalyticsFeatures } from './interfaces/analytics-features.interface'

const analyticsFeatures: IAnalyticsFeatures = {
    enabled: true,
    appStart: {
        enabled: true,
    },
    onboardingRoute: {
        enabled: true,
    },
    loginRoute: {
        enabled: true,
    },
    dashboardRoute: {
        enabled: true,
    },
    strongholdMigration: {
        enabled: true,
    },
    implicitAccountCreationRoute: {
        enabled: true,
    },
}

export default analyticsFeatures
