import { COIN_TYPE, DEFAULT_BASE_TOKEN } from '../constants'
import { NetworkId, TokenSupply } from '../enums'
import { NetworkMetadataMap } from '../types'

export const NETWORK_METADATA: Readonly<NetworkMetadataMap> = {
    [NetworkId.Iota]: {
        id: NetworkId.Iota,
        name: 'IOTA',
        coinType: COIN_TYPE[NetworkId.Iota],
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
        baseToken: DEFAULT_BASE_TOKEN[NetworkId.Iota],
        chains: [],
    },
    [NetworkId.Shimmer]: {
        id: NetworkId.Shimmer,
        name: 'Shimmer',
        coinType: COIN_TYPE[NetworkId.Shimmer],
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
        baseToken: DEFAULT_BASE_TOKEN[NetworkId.Shimmer],
        chains: [],
    },
    [NetworkId.Testnet]: {
        id: NetworkId.Testnet,
        name: 'Testnet',
        coinType: COIN_TYPE[NetworkId.Testnet],
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
        baseToken: DEFAULT_BASE_TOKEN[NetworkId.Testnet],
        chains: [],
    },
}
