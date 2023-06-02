import { getErc20TokenMetadata } from '@core/layer-2'
import { validateEthereumAddress } from '@core/utils/crypto/utils'
import { OFFICIAL_TOKEN_IDS } from '../constants'
import { NotVerifiedStatus, VerifiedStatus } from '../enums'
import { buildPersistedAssetFromMetadata } from '../helpers'
import { IErc20Metadata, IIrc30Metadata, IPersistedAsset } from '../interfaces'
import { AssetVerification } from '../types'
import { getIrc30MetadataFromFoundryOutput } from '../utils'

export async function requestPersistedAsset(tokenId: string, chainId?: number): Promise<IPersistedAsset | undefined> {
    let tokenMetadata: IIrc30Metadata | IErc20Metadata | undefined
    if (chainId) {
        try {
            validateEthereumAddress(tokenId)
            tokenMetadata = await getErc20TokenMetadata(tokenId, chainId)
        } catch {
            // do nothing
        }
    } else {
        tokenMetadata = await getIrc30MetadataFromFoundryOutput(tokenId)
    }
    if (tokenMetadata) {
        const verification: AssetVerification = OFFICIAL_TOKEN_IDS.includes(tokenId)
            ? { verified: true, status: VerifiedStatus.Official }
            : { verified: false, status: NotVerifiedStatus.New }
        const persistedAsset: IPersistedAsset = buildPersistedAssetFromMetadata(tokenId, tokenMetadata, verification)
        return persistedAsset
    }
}
