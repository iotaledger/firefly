import { IFeatureFlag } from './feature-flag.interface'

export interface IOnboardingFeaturesForNetwork extends IFeatureFlag {
    newProfile: IFeatureFlag & {
        softwareProfile: IFeatureFlag
        ledgerProfile: IFeatureFlag
    }
    restoreProfile: IFeatureFlag & {
        recoveryPhrase: IFeatureFlag
        strongholdBackup: IFeatureFlag
        ledgerBackup: IFeatureFlag
    }
    claimRewards: IFeatureFlag & {
        recoveryPhrase: IFeatureFlag
        strongholdBackup: IFeatureFlag
        ledgerBackup: IFeatureFlag
    }
    migrateFromLegacy?: IFeatureFlag
}
