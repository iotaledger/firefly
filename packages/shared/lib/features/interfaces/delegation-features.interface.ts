import { IFeatureFlag } from './feature-flag.interface'

export interface IDelegationFeatures extends IFeatureFlag {
    delegationList?: IFeatureFlag
    delegateOutput?: IFeatureFlag
    claimRewards?: IFeatureFlag
}
