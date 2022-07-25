import { IPersistedAsset } from './persisted-asset.interface'

export interface IPersistedAssets {
    [profileId: string]: {
        [tokenId: string]: IPersistedAsset
    }
}
