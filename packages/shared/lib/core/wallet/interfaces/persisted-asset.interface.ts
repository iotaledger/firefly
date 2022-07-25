import { VerificationStatus } from '../enums'
import { ITokenMetadata } from './token-metadata.interface'

export interface IPersistedAsset {
    id: string
    metadata?: ITokenMetadata
    hidden: boolean
    verification: VerificationStatus
}
