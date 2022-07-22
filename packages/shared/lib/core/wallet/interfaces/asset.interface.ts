import { IAssetBalance } from './asset-balance.interface'
import { ITokenMetadata } from './token-metadata.interface'

export interface IAsset {
    id: string
    metadata?: ITokenMetadata
    balance: IAssetBalance
    fiatPrice?: string
    fiatBalance?: string
    verified: boolean
    hidden?: boolean
}
