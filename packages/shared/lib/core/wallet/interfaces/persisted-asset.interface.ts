import { AssetVerification } from '../types'
import { TokenMetadata } from './token-metadata.interface'

export interface IPersistedAsset {
    id: string
    standard: string
    metadata?: TokenMetadata
    hidden: boolean
    verification: AssetVerification
}
