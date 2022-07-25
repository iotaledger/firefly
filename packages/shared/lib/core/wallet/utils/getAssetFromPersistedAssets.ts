import { IPersistedAsset } from '../interfaces'
import { getPersistedAsset } from '../stores/persisted-assets.store'

export function getAssetFromPersistedAssets(tokenId: string): IPersistedAsset {
    const persistedAsset = getPersistedAsset(tokenId)
    if (persistedAsset) {
        return persistedAsset
    } else {
        return undefined
    }
}
