import features from '@features/features'
import { NetworkId } from '../enums'

export function getEnabledNetworkFromFeatureFlags(): NetworkId {
    if (
        features.onboarding[NetworkId.Iota]?.enabled ||
        features.onboarding[NetworkId.IotaTestnet]?.enabled ||
        features.onboarding[NetworkId.IotaAlphanet]?.enabled
    ) {
        if (features.onboarding[NetworkId.Iota]?.enabled) {
            return NetworkId.Iota
        } else if (features.onboarding[NetworkId.IotaTestnet]?.enabled) {
            return NetworkId.IotaTestnet
        } else {
            return NetworkId.IotaAlphanet
        }
    } else if (
        features.onboarding[NetworkId.Shimmer]?.enabled ||
        features.onboarding[NetworkId.ShimmerTestnet]?.enabled
    ) {
        return features.onboarding[NetworkId.Shimmer]?.enabled ? NetworkId.Shimmer : NetworkId.ShimmerTestnet
    } else {
        return NetworkId.Custom
    }
}
