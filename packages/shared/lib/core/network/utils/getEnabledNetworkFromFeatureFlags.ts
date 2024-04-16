import features from '@features/features'
import { NetworkId } from '../enums'

export function getEnabledNetworkFromFeatureFlags(): NetworkId {
    if (features.onboarding[NetworkId.Iota]?.enabled || features.onboarding[NetworkId.IotaAlphanet]?.enabled) {
        return features.onboarding[NetworkId.Iota]?.enabled ? NetworkId.Iota : NetworkId.IotaAlphanet
    } else if (
        features.onboarding[NetworkId.Shimmer]?.enabled ||
        features.onboarding[NetworkId.ShimmerTestnet]?.enabled
    ) {
        return features.onboarding[NetworkId.Shimmer]?.enabled ? NetworkId.Shimmer : NetworkId.ShimmerTestnet
    } else {
        return NetworkId.Custom
    }
}
