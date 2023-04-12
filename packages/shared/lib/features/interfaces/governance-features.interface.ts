import { IFeatureFlag } from './feature-flag.interface'

export interface IGovernanceFeatures extends IFeatureFlag {
    removeProposals: IFeatureFlag
}
