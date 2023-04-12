import { NetworkId } from '@core/network'
import { IFeatureFlag } from '../interfaces/feature-flag.interface'
import { IOnboardingFeaturesForNetwork } from '@features/interfaces'

export type OnboardingFeatures = {
    [key in NetworkId]?: IOnboardingFeaturesForNetwork & IFeatureFlag
} & { strongholdVersionCheck: IFeatureFlag } & IFeatureFlag
