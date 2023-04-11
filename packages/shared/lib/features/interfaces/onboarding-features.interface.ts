import { NetworkProtocol, NetworkType } from '@core/network'
import { IFeatureFlag } from './feature-flag.interface'

interface IOnboardingFeaturesForNetwork extends IFeatureFlag {
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
}

export type OnboardingFeatures = {
    [key in NetworkProtocol]?: { [key in NetworkType]?: IOnboardingFeaturesForNetwork }
} & { strongholdVersionCheck: IFeatureFlag } & IFeatureFlag
