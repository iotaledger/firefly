import { getErc20TokenMetadata } from '@core/layer-2'
import { isValidEthereumAddress } from '@core/utils/crypto/utils'
import { OFFICIAL_TOKEN_IDS } from '../constants'
import { NotVerifiedStatus, VerifiedStatus } from '../enums'
import { buildPersistedAssetFromIrc30Metadata } from '../helpers'
import { IErc20Metadata, IIrc30Metadata, IPersistedAsset } from '../interfaces'
import { AssetVerification } from '../types'
import { getIrc30MetadataFromFoundryOutput } from '../utils'

export async function requestPersistedAsset(tokenId: string, chainId?: number): Promise<IPersistedAsset | undefined> {
    let tokenMetadata: IIrc30Metadata | IErc20Metadata | undefined
    if (chainId && isValidEthereumAddress(tokenId)) {
        tokenMetadata = await getErc20TokenMetadata(tokenId, chainId)
    } else {
        tokenMetadata = await getIrc30MetadataFromFoundryOutput(tokenId)
    }
    if (tokenMetadata) {
        const verification: AssetVerification = OFFICIAL_TOKEN_IDS.includes(tokenId)
            ? { verified: true, status: VerifiedStatus.Official }
            : { verified: false, status: NotVerifiedStatus.New }
        const persistedAsset: IPersistedAsset = buildPersistedAssetFromIrc30Metadata(
            tokenId,
            tokenMetadata,
            verification
        )
        return persistedAsset
    }
}
