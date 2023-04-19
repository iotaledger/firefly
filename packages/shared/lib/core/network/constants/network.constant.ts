import { BASE_TOKEN } from '../constants'
import { NetworkId, TokenSupply } from '../enums'
import { INetwork } from '../interfaces'

export const NETWORK: Readonly<{ [key in NetworkId]?: INetwork }> = {
    [NetworkId.Iota]: {
        id: NetworkId.Iota,
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
            tokenSupply: TokenSupply.Iota,
        },
        baseToken: BASE_TOKEN[NetworkId.Iota],
        chains: [],
    },
    [NetworkId.Shimmer]: {
        id: NetworkId.Shimmer,
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
            tokenSupply: TokenSupply.Shimmer,
        },
        baseToken: BASE_TOKEN[NetworkId.Shimmer],
        chains: [],
    },
    [NetworkId.Testnet]: {
        id: NetworkId.Testnet,
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
            tokenSupply: TokenSupply.Testnet,
        },
        baseToken: BASE_TOKEN[NetworkId.Testnet],
        chains: [],
    },
}
