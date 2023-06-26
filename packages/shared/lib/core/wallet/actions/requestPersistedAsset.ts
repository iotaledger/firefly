import { OFFICIAL_TOKEN_IDS } from '../constants'
import { NotVerifiedStatus, VerifiedStatus } from '../enums'
import { buildPersistedAssetFromMetadata } from '../helpers'
import { IPersistedAsset } from '../interfaces'
import { AssetVerification } from '../types'
import { getIrc30MetadataFromFoundryOutput } from '../utils'

export async function requestPersistedAsset(tokenId: string): Promise<IPersistedAsset | undefined> {
    const tokenMetadata = await getIrc30MetadataFromFoundryOutput(tokenId)
    if (tokenMetadata) {
        const verification: AssetVerification = OFFICIAL_TOKEN_IDS.includes(tokenId)
            ? { verified: true, status: VerifiedStatus.Official }
            : { verified: false, status: NotVerifiedStatus.New }
        const persistedAsset: IPersistedAsset = buildPersistedAssetFromMetadata(tokenId, tokenMetadata, verification)
        return persistedAsset
    }
}
