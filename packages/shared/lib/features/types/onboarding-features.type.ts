import { NetworkId } from '@core/network'
import { IFeatureFlag, IOnboardingFeaturesForNetwork } from '../interfaces'

export type OnboardingFeatures = {
    [key in NetworkId]?: IOnboardingFeaturesForNetwork & IFeatureFlag
} & { strongholdVersionCheck: IFeatureFlag } & IFeatureFlag & { balanceOverview: IFeatureFlag }
