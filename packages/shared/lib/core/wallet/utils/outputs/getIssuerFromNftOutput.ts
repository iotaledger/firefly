import { Address, FeatureType, IssuerFeature, NftOutput } from '@iota/wallet/out/types'

export function getIssuerFromNftOutput(output: NftOutput): Address {
    const metadata = output.immutableFeatures?.find((feature) => feature.type === FeatureType.Issuer) as IssuerFeature
    return metadata?.address
}
