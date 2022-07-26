import { buildPersistedAssetFromIrc30Metadata } from '../helpers'
import { IPersistedAsset } from '../interfaces'
import { addPersistedAsset } from '../stores/persisted-assets.store'
import { getIrc30MetadataFromFoundryOutput } from '../utils/getIrc30MetadataFromFoundryOutput'

export async function requestAndStorePersistedAsset(tokenId: string): Promise<IPersistedAsset> {
    const tokenMetadata = await getIrc30MetadataFromFoundryOutput(tokenId)
    if (tokenMetadata) {
        const persistedAsset: IPersistedAsset = buildPersistedAssetFromIrc30Metadata(tokenId, tokenMetadata)
        addPersistedAsset(persistedAsset)
        return persistedAsset
    } else {
        return undefined
    }
}
