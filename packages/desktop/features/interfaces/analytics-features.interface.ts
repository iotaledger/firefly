import { IFeatureFlag } from '@lib/features/interfaces'

export interface IAnalyticsFeatures extends IFeatureFlag {
    appStart: IFeatureFlag
    onboardingRoute: IFeatureFlag & {
        networkSetupRoute: IFeatureFlag
        profileSetupRoute: IFeatureFlag
        ledgerSetupRoute: IFeatureFlag
        strongholdSetupRoute: IFeatureFlag
        storageProtectionSetupRoute: IFeatureFlag
        profileBackupRoute: IFeatureFlag
        profileRecoveryRoute: IFeatureFlag
        shimmerClaimingRoute: IFeatureFlag
    }
    loginRoute: IFeatureFlag
    dashboardRoute: IFeatureFlag
}
