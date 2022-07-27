import { SPECIAL_TOKEN_ID } from '../constants'
import { VerificationStatus } from '../enums'
import { buildPersistedAssetFromIrc30Metadata } from '../helpers'
import { IPersistedAsset } from '../interfaces'
import { addPersistedAsset } from '../stores/persisted-assets.store'
import { getIrc30MetadataFromFoundryOutput } from '../utils/getIrc30MetadataFromFoundryOutput'

export async function requestAndStorePersistedAsset(tokenId: string): Promise<IPersistedAsset> {
    const tokenMetadata = await getIrc30MetadataFromFoundryOutput(tokenId)
    if (tokenMetadata) {
        const verificationStatus: VerificationStatus =
            tokenId === SPECIAL_TOKEN_ID ? VerificationStatus.Verified : VerificationStatus.New
        const persistedAsset: IPersistedAsset = buildPersistedAssetFromIrc30Metadata(
            tokenId,
            tokenMetadata,
            verificationStatus
        )
        addPersistedAsset(persistedAsset)
        return persistedAsset
    } else {
        return undefined
    }
}
