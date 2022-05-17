import { IAssetBalance } from './asset-balance.interface'
import { ITokenMetadata } from './token-metadata.interface'

export interface IAsset {
    metadata: ITokenMetadata
    // balance: string
    balance: IAssetBalance
    fiatPrice?: string
    fiatBalance?: string
}
