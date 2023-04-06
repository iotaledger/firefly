import { BASE_TOKEN } from '../constants'
import { Network, NetworkProtocol } from '../enums'
import { INetwork } from '../interfaces'

export const NETWORK: Readonly<{ [key in Network]?: INetwork }> = {
    [Network.Iota]: {
        id: Network.Iota,
        name: 'IOTA',
        protocol: {
            version: 1,
            networkName: 'iota',
            bech32Hrp: 'iota',
            minPowScore: 1500,
            belowMaxDepth: 15,
            rentStructure: {
                vByteCost: 500,
                vByteFactorData: 1,
                vByteFactorKey: 10,
            },
            tokenSupply: undefined,
        },
        baseToken: BASE_TOKEN[NetworkProtocol.IOTA],
    },
    [Network.Shimmer]: {
        id: Network.Shimmer,
        name: 'Shimmer',
        protocol: {
            version: 2,
            networkName: 'shimmer',
            bech32Hrp: 'smr',
            minPowScore: 1500,
            belowMaxDepth: 15,
            rentStructure: {
                vByteCost: 100,
                vByteFactorData: 1,
                vByteFactorKey: 10,
            },
            tokenSupply: '1813620509061365',
        },
        baseToken: BASE_TOKEN[NetworkProtocol.Shimmer],
    },
    [Network.Testnet]: {
        id: Network.Testnet,
        name: 'Testnet',
        protocol: {
            version: 2,
            networkName: 'testnet',
            bech32Hrp: 'rms',
            minPowScore: 1500,
            belowMaxDepth: 15,
            rentStructure: {
                vByteCost: 100,
                vByteFactorData: 1,
                vByteFactorKey: 10,
            },
            tokenSupply: '1450896407249092',
        },
        baseToken: BASE_TOKEN[NetworkProtocol.Shimmer],
    },
}
