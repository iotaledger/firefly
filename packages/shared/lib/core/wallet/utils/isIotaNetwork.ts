import { getEnabledNetworkFromFeatureFlags, NetworkId } from '../../network'

export function isIotaNetwork(): boolean {
    const NETWORK_ID = getEnabledNetworkFromFeatureFlags()
    return NETWORK_ID === NetworkId.Iota
}
