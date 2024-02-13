import { IFeatureFlag } from './feature-flag.interface'

export interface IDeveloperFeatures extends IFeatureFlag {
    faucet: IFeatureFlag
    mintNft: IFeatureFlag
    mintNativeTokens: IFeatureFlag
    account: IFeatureFlag
    refreshTokens: IFeatureFlag
    deeplink: IFeatureFlag
}
