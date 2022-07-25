import { ITokenMetadata } from './token-metadata.interface'

export interface IPersistedAssetMetadata {
    [key: string]: ITokenMetadata
}
