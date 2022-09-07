import { AssetStandard, VerificationStatus } from '../enums'
import { IIrc30Metadata, IPersistedAsset } from '../interfaces'
import { getIconColorFromString } from '@core/account'

export function buildPersistedAssetFromIrc30Metadata(
    tokenId: string,
    metadata: IIrc30Metadata,
    verification = VerificationStatus.New
): IPersistedAsset {
    return {
        id: tokenId,
        standard: AssetStandard.IRC30,
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
