import { BASE_TOKEN } from '../constants'
import { Network, NetworkProtocol, NetworkType } from '../enums'
import { INetwork } from '../interfaces'

export const NETWORK: Readonly<{ [key in Network]?: INetwork }> = {
    [Network.Iota]: {
        id: Network.Iota,
        name: 'IOTA',
        protocol: NetworkProtocol.IOTA,
        type: NetworkType.Mainnet,
        bech32Hrp: 'iota',
        baseToken: BASE_TOKEN[NetworkProtocol.IOTA],
        rentStructure: {
            vByteCost: 500,
            vByteFactorData: 10,
            vByteFactorKey: 1,
        },
    },
    [Network.Shimmer]: {
        id: Network.Shimmer,
        name: 'Shimmer',
        protocol: NetworkProtocol.Shimmer,
        type: NetworkType.Mainnet,
        bech32Hrp: 'smr',
        baseToken: BASE_TOKEN[NetworkProtocol.Shimmer],
        rentStructure: {
            vByteCost: 500,
            vByteFactorData: 10,
            vByteFactorKey: 1,
        },
    },
    [Network.Testnet]: {
        id: Network.Testnet,
        name: 'Testnet',
        protocol: NetworkProtocol.Shimmer,
        type: NetworkType.Devnet,
        bech32Hrp: 'rms',
        baseToken: BASE_TOKEN[NetworkProtocol.Shimmer],
        rentStructure: {
            vByteCost: 500,
            vByteFactorData: 10,
            vByteFactorKey: 1,
        },
    },
}
