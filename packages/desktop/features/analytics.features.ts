import { IAnalyticsFeatures } from './interfaces/analytics-features.interface'

const analyticsFeatures: IAnalyticsFeatures = {
    enabled: true,
    appStart: {
        enabled: true,
    },
    onboardingRoute: {
        enabled: true,
        networkSetupRoute: {
            enabled: true,
        },
        profileSetupRoute: {
            enabled: true,
        },
        ledgerSetupRoute: {
            enabled: true,
        },
        strongholdSetupRoute: {
            enabled: true,
        },
        storageProtectionSetupRoute: {
            enabled: true,
        },
        profileBackupRoute: {
            enabled: true,
        },
        profileRecoveryRoute: {
            enabled: true,
        },
        shimmerClaimingRoute: {
            enabled: true,
        },
    },
    loginRoute: {
        enabled: true,
    },
    dashboardRoute: {
        enabled: true,
    },
}

export default analyticsFeatures
