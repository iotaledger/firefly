import { FEATURE_TYPE_ISSUER } from '@core/wallet/constants'
import type { AddressTypes, IIssuerFeature, INftOutput } from '@iota/types'

export function getIssuerFromNftOutput(output: INftOutput): AddressTypes {
    const metadata = output.immutableFeatures?.find((feature) => feature.type === FEATURE_TYPE_ISSUER) as IIssuerFeature
    return metadata?.address
}
