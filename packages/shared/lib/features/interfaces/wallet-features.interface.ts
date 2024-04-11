import { IFeatureFlag } from './feature-flag.interface'

export interface IWalletFeatures extends IFeatureFlag {
    walletSummary: IFeatureFlag
    sendAndReceive: IFeatureFlag & {
        nft: IFeatureFlag
    }
    assets: IFeatureFlag & {
        burnAsset: IFeatureFlag
    }
    activityHistory: IFeatureFlag & {
        sync: IFeatureFlag
        search: IFeatureFlag
    }
    multiWallet: IFeatureFlag
}
