import { IFeatureFlag } from './feature-flag.interface'

interface INewProfileFeatures extends IFeatureFlag {
    softwareProfile: IFeatureFlag
    ledgerProfile: IFeatureFlag
}

interface IRestoreProfileFeatures extends IFeatureFlag {
    recoveryPhrase: IFeatureFlag
    strongholdBackup: IFeatureFlag
    ledgerBackup: IFeatureFlag
}

interface IClaimRewardsFeatures extends IFeatureFlag {
    recoveryPhrase: IFeatureFlag
    strongholdBackup: IFeatureFlag
    ledgerBackup: IFeatureFlag
}

interface IOnboardingFeaturesForNetwork extends IFeatureFlag {
    newProfile: INewProfileFeatures
    restoreProfile: IRestoreProfileFeatures
    claimRewards: IClaimRewardsFeatures
}

export interface IOnboardingFeatures extends IFeatureFlag {
    iota: IOnboardingFeaturesForNetwork
    shimmer: IOnboardingFeaturesForNetwork
    testnet: IOnboardingFeaturesForNetwork
    custom: IOnboardingFeaturesForNetwork
    strongholdVersionCheck: IFeatureFlag
}
