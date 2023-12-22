import { IFeatureFlag } from '@lib/features/interfaces'

export interface IAnalyticsFeatures extends IFeatureFlag {
    appStart: IFeatureFlag
    onboardingRoute: IFeatureFlag
    loginRoute: IFeatureFlag
    dashboardRoute: IFeatureFlag
    strongholdMigration: IFeatureFlag
    accountRoute: IFeatureFlag
}
