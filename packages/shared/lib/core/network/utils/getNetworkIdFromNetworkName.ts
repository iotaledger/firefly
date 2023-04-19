import { NetworkId } from '../enums'

export function getNetworkIdFromNetworkName(networkName: string): NetworkId {
    switch (networkName) {
        case 'shimmer':
            return NetworkId.Shimmer
        case 'testnet':
            return NetworkId.Testnet
        case 'testnet-1':
            return NetworkId.Testnet
        default:
            return NetworkId.Custom
    }
}
