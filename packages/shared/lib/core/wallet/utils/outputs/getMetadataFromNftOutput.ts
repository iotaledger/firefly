import { FEATURE_TYPE_METADATA } from '@core/wallet/constants'
import type { IMetadataFeature, INftOutput } from '@iota/types'

export function getMetadataFromNftOutput(output: INftOutput): string {
    const metadata = output.immutableFeatures?.find(
        (feature) => feature.type === FEATURE_TYPE_METADATA
    ) as IMetadataFeature
    return metadata?.data
}
