import { SPECIAL_TOKEN_ID } from '../constants'
import { NotVerifiedStatus, VerifiedStatus } from '../enums'
import { buildPersistedAssetFromIrc30Metadata } from '../helpers'
import { IPersistedAsset } from '../interfaces'
import { addPersistedAsset } from '../stores/persisted-assets.store'
import { AssetVerification } from '../types'
import { getIrc30MetadataFromFoundryOutput } from '../utils/getIrc30MetadataFromFoundryOutput'

export async function requestAndStorePersistedAsset(tokenId: string): Promise<IPersistedAsset> {
    const tokenMetadata = await getIrc30MetadataFromFoundryOutput(tokenId)
    if (tokenMetadata) {
        const verification: AssetVerification =
            tokenId === SPECIAL_TOKEN_ID
                ? { verified: true, status: VerifiedStatus.Official }
                : { verified: false, status: NotVerifiedStatus.New }
        const persistedAsset: IPersistedAsset = buildPersistedAssetFromIrc30Metadata(
            tokenId,
            tokenMetadata,
            verification
        )
        addPersistedAsset(persistedAsset)
        return persistedAsset
    } else {
        return undefined
    }
}
