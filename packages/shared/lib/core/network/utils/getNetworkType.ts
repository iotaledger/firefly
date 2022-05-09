import { NETWORK } from '../constants'
import { NetworkProtocol, NetworkType } from '../enums'

export function getNetworkType(protocol: NetworkProtocol, id: string): NetworkType {
    if (id) {
        return Object.values(NETWORK[protocol]).find((network) => network.id === id)?.type ?? NetworkType.PrivateNet
    }
}
