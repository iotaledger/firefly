import { NetworkId } from '../enums'

export function getNetworkIdFromNetworkName(networkName: string): NetworkId {
    if(networkName.startsWith('iota-alphanet')){
        return NetworkId.IotaAlphanet
    }
    switch (networkName) {
        case 'iota-mainnet':
        case 'stardust-mainnet-pre1':
            return NetworkId.Iota
        case 'shimmer':
            return NetworkId.Shimmer
        case 'testnet':
        case 'testnet-1':
        case 'testnet-2':
        case 'docker':
        case 'iota2-alphanet':
            return NetworkId.Testnet
        default:
            return NetworkId.Custom
    }
}
