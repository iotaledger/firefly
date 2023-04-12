import { AssetVerification } from '../types'
import { TokenMetadata } from '../types/token-metadata.type'

export interface IPersistedAsset {
    id: string
    standard: string
    metadata?: TokenMetadata
    hidden: boolean
    verification: AssetVerification
}
