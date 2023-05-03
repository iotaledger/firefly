import { IFeatureFlag } from './feature-flag.interface'

export interface INetworkFeatures extends IFeatureFlag {
    layer2: IFeatureFlag
    config: IFeatureFlag & {
        addChain: IFeatureFlag
    }
}
