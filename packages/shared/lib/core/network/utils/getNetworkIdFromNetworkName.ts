import { NetworkId } from '../enums'

export function getNetworkIdFromNetworkName(networkName: string): NetworkId {
    const splitName = networkName?.split(/[\s,-]+/)[0]
    switch (splitName) {
        case 'shimmer':
            return NetworkId.Shimmer
        case 'testnet':
            return NetworkId.Testnet
        default:
            return NetworkId.Custom
    }
}
