import { NotVerifiedStatus, TokenStandard } from '../enums'
import { IErc20Metadata, IIrc30Metadata, IPersistedAsset } from '../interfaces'
import { AssetVerification } from '../types'

export function buildPersistedAssetFromIrc30Metadata(
    tokenId: string,
    metadata: IIrc30Metadata | IErc20Metadata,
    verification: AssetVerification = { verified: false, status: NotVerifiedStatus.New }
): IPersistedAsset {
    let asset = {
        id: tokenId,
        standard: metadata.standard,
        metadata: {
            standard: metadata.standard,
            name: metadata.name,
            symbol: metadata.symbol,
            decimals: metadata.decimals,
        },
        hidden: false,
        verification,
    }
    if (metadata.standard === TokenStandard.Irc30) {
        asset = {
            ...asset,
            ...(metadata?.description && { description: metadata?.description }),
            ...(metadata?.url && { url: metadata?.url }),
            ...(metadata?.logoUrl && { logoUrl: metadata?.logoUrl }),
            ...(metadata?.logo && { logo: metadata?.logo }),
        }
    }
    return asset
}
