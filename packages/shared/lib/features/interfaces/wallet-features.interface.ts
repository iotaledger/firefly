import { IFeatureFlag } from './feature-flag.interface'

export interface IWalletFeatures extends IFeatureFlag {
    accountSummary: IFeatureFlag
    sendAndReceive: IFeatureFlag & {
        nft: IFeatureFlag
    }
    showLayer2: IFeatureFlag
    assets: IFeatureFlag & {
        burnAsset: IFeatureFlag
    }
    activityHistory: IFeatureFlag & {
        sync: IFeatureFlag
        search: IFeatureFlag
    }
}
