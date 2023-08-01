import { Address, FeatureType, IssuerFeature, NftOutput } from '@iota/wallet/out/types'

export function getIssuerFromNftOutput(output: NftOutput): Address {
    const metadata = output
        .getImmutableFeatures()
        ?.find((feature) => feature.getType() === FeatureType.Issuer) as IssuerFeature
    return metadata?.getIssuer()
}
