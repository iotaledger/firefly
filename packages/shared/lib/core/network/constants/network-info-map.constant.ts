import { BASE_TOKEN } from '../constants'
import { NetworkProtocol, NetworkType } from '../enums'
import { NetworkInfoMap } from '../types'

export const NETWORK_INFO_MAP: Readonly<NetworkInfoMap> = {
    [NetworkProtocol.IOTA]: {
        [NetworkType.Mainnet]: {
            id: 'iota-mainnet',
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
        [NetworkType.Devnet]: {
            id: 'iota-devnet',
            name: 'IOTA Devnet',
            protocol: NetworkProtocol.IOTA,
            type: NetworkType.Devnet,
            bech32Hrp: 'atoi',
            baseToken: BASE_TOKEN[NetworkProtocol.IOTA],
            rentStructure: {
                vByteCost: 500,
                vByteFactorData: 10,
                vByteFactorKey: 1,
            },
        },
        [NetworkType.PrivateNet]: {
            name: 'Private Net',
            protocol: NetworkProtocol.IOTA,
            type: NetworkType.PrivateNet,
        },
    },
    [NetworkProtocol.Shimmer]: {
        [NetworkType.Mainnet]: {
            id: 'shimmer-mainnet',
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
        [NetworkType.Devnet]: {
            id: 'testnet',
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
        [NetworkType.PrivateNet]: {
            name: 'Private Net',
            protocol: NetworkProtocol.Shimmer,
            type: NetworkType.PrivateNet,
        },
    },
}
