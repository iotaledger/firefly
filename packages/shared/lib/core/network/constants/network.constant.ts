import { BASE_TOKEN } from '../constants'
import { NetworkId, NetworkProtocol, NetworkType } from '../enums'
import { INetwork } from '../interfaces'

export const NETWORK: Readonly<{ [key in NetworkProtocol]?: { [key in NetworkType]?: INetwork } }> = {
    [NetworkProtocol.IOTA]: {
        [NetworkType.Mainnet]: {
            id: NetworkId.Iota,
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
            id: NetworkId.Custom,
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
        [NetworkType.PrivateNet]: <INetwork>{
            name: NetworkId.Custom,
            protocol: NetworkProtocol.IOTA,
            type: NetworkType.PrivateNet,
        },
    },
    [NetworkProtocol.Shimmer]: {
        [NetworkType.Mainnet]: {
            id: NetworkId.Shimmer,
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
            id: NetworkId.Testnet,
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
        [NetworkType.PrivateNet]: <INetwork>{
            name: NetworkId.Custom,
            protocol: NetworkProtocol.Shimmer,
            type: NetworkType.PrivateNet,
        },
    },
}
