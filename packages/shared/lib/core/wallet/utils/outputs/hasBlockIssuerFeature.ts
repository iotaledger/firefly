import { AccountOutput, Feature, FeatureType } from '@iota/sdk/out/types'

export function hasBlockIssuerFeature(account: AccountOutput): boolean {
    return account.features?.some((feature: Feature) => feature.type === FeatureType.BlockIssuer) ?? false
}
