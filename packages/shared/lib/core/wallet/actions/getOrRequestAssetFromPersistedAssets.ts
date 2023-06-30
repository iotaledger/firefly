import { IPersistedAsset } from '../interfaces'
import { getPersistedAsset } from '../stores/persisted-assets.store'
import { requestPersistedAsset } from '.'

export async function getOrRequestAssetFromPersistedAssets(tokenId: string): Promise<IPersistedAsset | undefined> {
    const persistedAsset = getPersistedAsset(tokenId)
    if (persistedAsset) {
        return Promise.resolve(persistedAsset)
    } else {
        return requestPersistedAsset(tokenId)
    }
}
