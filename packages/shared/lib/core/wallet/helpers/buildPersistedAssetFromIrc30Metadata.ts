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
        standard: TokenStandard.Irc30,
        metadata: {
            name: metadata.name,
            unit: metadata.symbol,
            decimals: metadata.decimals,
            useMetricPrefix: false,
            primaryColor: getIconColorFromString(metadata?.name),
            ...(metadata?.description && { description: metadata?.description }),
            ...(metadata?.url && { url: metadata?.url }),
            ...(metadata?.logoUrl && { logoUrl: metadata?.logoUrl }),
            ...(metadata?.logo && { logo: metadata?.logo }),
        },
        hidden: false,
        verification,
    }
}
