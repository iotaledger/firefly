import { NetworkId } from '../enums'

export function getNetworkIdFromNetworkName(networkName: string): NetworkId {
    switch (networkName) {
        case 'iota-mainnet':
        case 'stardust-mainnet-pre1':
            return NetworkId.Iota
        case 'testnet':
            return NetworkId.IotaTestnet
        case 'iota-alphanet':
        case 'iota-alphanet-2':
            return NetworkId.IotaAlphanet
        case 'shimmer':
            return NetworkId.Shimmer
        case 'testnet-1':
        case 'testnet-2':
            return NetworkId.ShimmerTestnet
        default:
            return NetworkId.Custom
    }
}
