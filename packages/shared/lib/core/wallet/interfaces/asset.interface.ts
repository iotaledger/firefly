import { IAssetBalance } from './asset-balance'
import { ITokenMetadata } from './token-metadata.interfaces'

export interface IAsset {
    metadata: ITokenMetadata
    // balance: string
    balance: IAssetBalance
    fiatPrice?: string
    fiatBalance?: string
}
