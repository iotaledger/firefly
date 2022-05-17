import { NetworkProtocol, NetworkType } from '@core/network'
import { updateNewProfile } from '@core/profile'

export function updateNewProfileNetwork(protocol: NetworkProtocol, type: NetworkType): void {
    const isPrivateNet = type === NetworkType.PrivateNet
    updateNewProfile({ networkProtocol: isPrivateNet ? protocol : undefined })
    updateNewProfile({ networkType: type })
}
