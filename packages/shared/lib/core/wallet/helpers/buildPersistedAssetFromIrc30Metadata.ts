import { NotVerifiedStatus, TokenStandard } from '../enums'
import { IIrc30Metadata, IPersistedAsset } from '../interfaces'
import { getIconColorFromString } from '@core/account'
import { AssetVerification } from '../types'

export function buildPersistedAssetFromIrc30Metadata(
    tokenId: string,
    metadata: IIrc30Metadata,
    verification: AssetVerification = { verified: false, status: NotVerifiedStatus.New }
): IPersistedAsset {
    return {
        id: tokenId,
        standard: TokenStandard.IRC30,
        metadata: {
            name: metadata.name,
            unit: metadata.symbol,
            decimals: metadata.decimals,
            useMetricPrefix: false,
            primaryColor: getIconColorFromString(metadata?.name),
            ...(metadata?.description && { description: metadata?.description }),
            ...(metadata?.url && { description: metadata?.url }),
            ...(metadata?.logoUrl && { description: metadata?.logoUrl }),
            ...(metadata?.logo && { description: metadata?.logo }),
        },
        hidden: false,
        verification,
    }
}
