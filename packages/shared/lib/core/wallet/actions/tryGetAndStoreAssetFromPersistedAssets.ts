import { IPersistedAsset } from '../interfaces'
import { getPersistedAsset } from '../stores/persisted-assets.store'
import { requestAndStorePersistedAsset } from './'

export async function tryGetAndStoreAssetFromPersistedAssets(tokenId: string): Promise<IPersistedAsset> {
    const persistedAsset = getPersistedAsset(tokenId)
    if (persistedAsset) {
        return Promise.resolve(persistedAsset)
    } else {
        return requestAndStorePersistedAsset(tokenId)
    }
}
